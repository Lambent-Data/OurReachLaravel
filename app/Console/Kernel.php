<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\ResetGoalsCommand;
use Carbon\Carbon;
use App\Models\Goal;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        ResetGoalsCommand::class
    ];
     
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $filePath = 'log/reset_goals.txt';
        //$schedule->job(new ResetGoals)->everyMinute();
        $schedule->command('reset:cron')
                 ->everyMinute()
                 ->appendOutputTo($filePath);
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
