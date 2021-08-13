<?php
   
namespace App\Console\Commands;
   
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Goal;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ResetGoalsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reset:cron';
    
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset all goals that have passed the deadline, if completed';
    
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            $goal_ids = Goal::where('repeat_rule', 'not like', '%one-time%')
                            ->where(function($query){
                                $query->where('next_deadline', '<=', Carbon::now()->subHours(3)->setTimezone('UTC')->toDateTimeString())
                                      ->orWhere(function($inner_query){
                                            $inner_query->where('next_deadline', '<=', Carbon::now()->setTimezone('UTC')->toDateTimeString())
                                                        ->where('completed', 1);
                                    });
                                })->select('id');
            $output = [];
            foreach ($goal_ids as $goal_id) {
                try {
                    $goal = Goal::findOrFail($goal_id);
                    if ($goal->try_reset()){
                        $goal->save();
                        $output[] = $goal->id;
                    }
                } catch (ModelNotFoundException $e) {
                    // Not found - that's weird, but not a problem. Just continue.                    
                }
            }
            $this->info(Carbon::now()->toDateTimeString().'|| Reset: '.implode(", ", $output).'<br/>');
        } catch(\Exception $e){
            $this->info(Carbon::now()->toDateTimeString().'|| Reset exception: '.$e->getMessage().'<br/>');
        }

    }
}