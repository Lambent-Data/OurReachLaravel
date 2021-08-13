<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use App\Models\Goal;

class ResetGoals implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {   
        $g = Goal::find(21);
        $g->notes = Carbon::now()->setTimezone('UTC')->toDateTimeString();
        $g->save();
        /*
        $goals = Goal::where('next_deadline', '<=', Carbon::now()->subHours(3)->setTimezone('UTC')->toDateTimeString())
                        ->orWhere(function($query){
                            $query->where('next_deadline', '<=', Carbon::now()->setTimezone('UTC')->toDateTimeString())
                                  ->where('completed', 1);
                        })->get();
        foreach ($goals as $goal) {
            $goal->try_reset();
        }
        */
    }
}
