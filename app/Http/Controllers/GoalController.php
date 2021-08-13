<?php

namespace App\Http\Controllers;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Http\Controllers\Controller;
use App\Models\Milestone;
use App\Models\Goal;
use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;


class GoalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return "Here is the listing page.";
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return "Here is the creating form page.";
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $goal = new Goal;
            /* Required */
            $goal->user_id = $request->input('user_id');
            $goal->name = $request->input('name');
            /* Optional */
            // This field is not used, 2500 is an arbitrary default value
            $goal->ruko_id_external = $request->input('ruko_id_external', 2500);
            $goal->milestone_id = $request->input('milestone_id', null);
            $goal->template_id = $request->input('template_id', null);
            $goal->category = $request->input('category', null);
            $goal->description = $request->input('description', '');
            $goal->completed = $request->input('completed', false);
            $goal->history = $request->input('history', "{}");
            $goal->history_buffer = $request->input('history_buffer', "{}");
            $goal->repeat_rule = $request->input('repeat_rule', json_encode([ "type" => "one-time", 
                                                                              "startingOn" => Carbon::now()->addDay()->toDateTimeString(),
                                                                              "frequency" => 1,
                                                                              "times" => [17*3600],
                                                                              "daysOfWeek" => [],
                                                                              "daysOfMonth" => []
                                                                            ]));
            $goal->current_streak = $request->input('current_streak', 0);
            $goal->best_streak = $request->input('best_streak', 0);
            $goal->total_occurrences = $request->input('total_occurrences', 0);
            $goal->total_completions = $request->input('total_completions', 0);
            $goal->private = $request->input('private', false);
            $goal->active = $request->input('active', true);
            $goal->notes = $request->input('notes', '');
            $goal->permissions = $request->input('permissions', json_encode([]));

            // Compute next deadline from repeat rule
            $goal->set_deadline_from_repeat_rule();
            
            if ($goal->completed){
                $goal->try_reset();
            }
            $goal->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => $goal->toArrayRecursive(true)]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return "Here is the view page for Goal ".$id;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function retrieve($id)
    {
        try {
            $goal = Goal::with('links')->findOrFail($id);
            if ($goal->completed){
                $goal->try_reset();
            }
            return response()->json(["status" => "SUCCESS", "data" => $goal->toArray()]);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "Goal does not exist."]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
       return "We're not going to use this.";
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $goal = Goal::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "Goal does not exist."]);
        }

        try {
            $goal->update_from_request($request);
            $goal->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => $goal->toArrayRecursive(false)]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Goal::destroy($id);
        return response()->json(["status" => "SUCCESS", "data" => "Goal ".$id." destroyed."]);
    }
}
