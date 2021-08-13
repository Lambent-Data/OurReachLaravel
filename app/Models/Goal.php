<?php

namespace App\Models;

use RRule\RRule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonTimeZone;

class Goal extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql';
    protected $table = 'ld_goals';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }

    public function links()
    {
        return $this->morphMany(Link::class, 'link_owner');
    }

    public function toArrayRecursive($includeLinks = true)
    {
        $resp = $this->toArray();

        if ($includeLinks) {
            $resp["links"] = $this->links->map(function ($link, $key) {
                return $link->toArrayRecursive();
            });
        }
        return $resp;
    }

    public function get_repeat_rule(){
        return json_decode($this->repeat_rule);
    }

    // See RRULE: https://github.com/rlanvin/php-rrule/wiki/RRule
    public function get_rrule(){
        $mapDayString = function($day) {
            // Just take the first two characters of the day, e.g. SUN -> SU
            return substr($day, 0,2);
        };

        $rpt = $this->get_repeat_rule();
        $bydays = array_map($mapDayString, $rpt->daysOfWeek);
        $starting_date = $rpt->startingOn;
        
        /* Currently just support one time-of-day */
        $firstTimeOfDay = $rpt->times[0]; // In seconds since midnight
        $hr = floor($firstTimeOfDay/3600);
        $min = floor(($firstTimeOfDay - $hr * 3600)/60);
        switch ($rpt->type){
            case "one-time":
                return new RRule([
                    'FREQ' => RRule::YEARLY,
                    'DTSTART' => $starting_date,
                    'COUNT' => 1,
                    'BYHOUR' => $hr,
                    'BYMINUTE' => $min
                ]);
            case "daily":
                return new RRule([
                    'FREQ' => RRule::DAILY,
                    'DTSTART' => $starting_date,
                    'INTERVAL' => $rpt->frequency,
                    'BYHOUR' => $hr,
                    'BYMINUTE' => $min
                ]);
            case "weekly":
                return new RRule([
                    'FREQ' => RRule::WEEKLY,
                    'DTSTART' => $starting_date,
                    'INTERVAL' => $rpt->frequency,
                    'BYDAY' => $bydays,
                    'BYHOUR' => $hr,
                    'BYMINUTE' => $min
                ]);
            case "monthly":
                return new RRule([
                    'FREQ' => RRule::MONTHLY,
                    'DTSTART' => $starting_date,
                    'INTERVAL' => $rpt->frequency,
                    'BYMONTHDAY' => $rpt->daysOfMonth,
                    'BYHOUR' => $hr,
                    'BYMINUTE' => $min
                ]);
            case "yearly":
                return new RRule([
                    'FREQ' => RRule::YEARLY,
                    'DTSTART' => $starting_date,
                    'INTERVAL' => $rpt->frequency,
                    'BYHOUR' => $hr,
                    'BYMINUTE' => $min
                ]);
        }
        throw new Exception('No rrule data');
    }

    public function compute_next_deadline(){
        $localTz = new CarbonTimeZone($this->get_repeat_rule()->timezone);
        $next = $this->get_rrule()->getNthOccurrenceAfter(Carbon::now($localTz), 1);
        $deadline = new Carbon($next, $localTz);
        return $deadline->setTimezone('UTC')->toDateTimeString();
    }

    public function set_deadline_from_repeat_rule(){
        $localTz = new CarbonTimeZone($this->get_repeat_rule()->timezone);
        $next = $this->get_rrule()->getNthOccurrenceAfter(Carbon::now($localTz), 1);
        if (!$next) {
            $next = $this->get_rrule()->getNthOccurrenceBefore(Carbon::now($localTz), 1);
        }
        $deadline = new Carbon($next, $localTz);
        $this->next_deadline = $deadline->setTimezone('UTC')->toDateTimeString();        
    }

    public function try_reset(){
        // For a non-recurring goal, if it is completed and the deadline is past, or if the deadline passed more than 3 hours ago, reset the goal
        $deadline = new Carbon($this->next_deadline, 'UTC');
        if ($this->get_repeat_rule()->type != "one-time" && 
            (($this->completed && $deadline->isPast()) || $deadline->addHours(3)->isPast())){
            $this->set_deadline_from_repeat_rule();
            $this->completed = false;
            return true;
        }
        return false;
    }

    public function update_from_request(Request $request){
        if ($request->has('user_id'))
            $this->user_id = $request->input('user_id');
        if ($request->has('milestone_id'))
            $this->milestone_id = $request->input('milestone_id');
        if ($request->has('template_id'))
            $this->template_id = $request->input('template_id');
        if ($request->has('category'))
            $this->category = $request->input('category');
        if ($request->has('name'))
            $this->name = $request->input('name');
        if ($request->has('description'))
            $this->description = $request->input('description');
        if ($request->has('completed')){
            if (!$this->completed && $request->input('completed')){
                // Record latest time completed
                $hist = json_decode($this->history);
                $hist = ['last_completed' => Carbon::now()->toDateTimeString()];
                $this->history = json_encode($hist);
            }
            $this->completed = $request->input('completed');
        }
        if ($request->has('repeat_rule'))
            $this->repeat_rule = $request->input('repeat_rule');
        if ($request->has('current_streak'))
            $this->current_streak = $request->input('current_streak');
        if ($request->has('best_streak'))
            $this->best_streak = $request->input('best_streak');
        if ($request->has('total_occurrences'))
            $this->total_occurrences = $request->input('total_occurrences');
        if ($request->has('total_completions'))
            $this->total_completions = $request->input('total_completions');
        if ($request->has('private'))
            $this->private = $request->input('private');
        if ($request->has('active'))
            $this->active = $request->input('active');
        if ($request->has('notes'))
            $this->notes = $request->input('notes');
        if ($request->has('permissions'))
            $this->permissions = $request->input('permissions');

        // If the repeat rule has changed, recompute next deadline
        if ($request->has('repeat_rule'))
            $this->set_deadline_from_repeat_rule();

        if ($this->completed){
            $this->try_reset();
        }
    }
}
