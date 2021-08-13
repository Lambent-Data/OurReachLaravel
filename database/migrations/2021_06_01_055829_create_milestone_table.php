<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMilestoneTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ld_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('ruko_id_external');
            $table->string('template_id')->nullable();
            $table->enum('category', ['Health', 'Jobs', 'Money', 'Children', 'Education', 'Housing', 'Other']);
            $table->string('subcategory', 127);
            $table->boolean('completed');
            $table->string('name', 127);
            $table->string('inspirational_image_url', 1023)->nullable();
            $table->dateTime('deadline')->nullable();
            $table->json('measure_data');
            $table->string('start_measure', 63);
            $table->string('end_measure', 63);
            $table->text('vision');
            $table->text('purpose'); 
            $table->text('obstacles');
            $table->boolean('private');
            $table->text('notes');
            $table->json('permissions');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ld_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('ruko_id_external');
            $table->foreignId('milestone_id')->nullable();
            $table->string('template_id')->nullable();
            $table->enum('category', ['Health', 'Jobs', 'Money', 'Children', 'Education', 'Housing', 'Other'])->nullable();
            $table->string('name', 63);
            $table->text('description');
            $table->boolean('completed');
            $table->dateTime('next_deadline');
            $table->json('repeat_rule');
            $table->json('history');
            $table->json('history_buffer');
            $table->unsignedInteger('current_streak');
            $table->unsignedInteger('best_streak');
            $table->unsignedInteger('total_occurrences');
            $table->unsignedInteger('total_completions');
            $table->boolean('private');
            $table->boolean('active');
            $table->text('notes');
            $table->json('permissions');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ld_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('link_owner_id')->nullable();
            $table->string('link_owner_type');
            $table->enum('origin', ['user', 'staff', 'template']);
            $table->boolean('hidden');
            $table->string('name', 127);
            $table->string('url', 1023);
            $table->text('notes');
            $table->json('permissions');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ld_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('milestone_id');
            $table->string('comment_text', 512);
            $table->dateTime('last_edited');
            $table->json('permissions');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ld_milestones');
        Schema::dropIfExists('ld_goals');
        Schema::dropIfExists('ld_links');
        Schema::dropIfExists('ld_comments');
    }
}
