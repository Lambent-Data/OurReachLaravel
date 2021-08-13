<?php

namespace App\Http\Controllers;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Http\Controllers\Controller;
use App\Models\Milestone;
use App\Models\RukoMilestone;
use App\Models\Goal;
use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class MilestoneController extends Controller
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
            $milestone = new Milestone;
            /* Required */
            $milestone->user_id = $request->input('user_id');
            $milestone->name = $request->input('name');
            $milestone->category = $request->input('category');
            $milestone->subcategory = $request->input('subcategory');
            /* Optional */
            $milestone->completed = $request->input('completed', false);
            $milestone->deadline = $request->input('deadline', null);
            $milestone->measure_data = $request->input('measure_data', json_encode(['type' => 'none']));
            $milestone->start_measure = $request->input('start_measure', '');
            $milestone->end_measure = $request->input('end_measure', '');
            $milestone->template_id = $request->input('template_id', null);
            $milestone->inspirational_image_url = $request->input('inspirational_image_url', null);
            $milestone->vision = $request->input('vision', '');
            $milestone->purpose = $request->input('purpose', '');
            $milestone->obstacles = $request->input('obstacles', '');
            $milestone->notes = $request->input('notes', '');
            $milestone->private = $request->input('private', false);
            $milestone->permissions = $request->input('permissions', json_encode([]));

            $rm = RukoMilestone::updateOrCreate($milestone);
            $milestone->ruko_id_external = $rm->id;

            $milestone->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => $milestone->toArray()]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return "Here is the view page for Milestone ".$id;
    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function retrieve(Request $request, $id)
    {
        try {
            $milestone = Milestone::findOrFail($id);
            $needGoals = $request->input('goals', true);
            $needLinks = $request->input('links', true);
            $needComments = $request->input('comments', true);
            
            $resp = ["status" => "SUCCESS", "data" => $milestone->toArrayRecursive($needGoals, $needLinks, $needComments)];

            return response()->json($resp);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "Milestone does not exist."]);
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }


    }

    public function retrieveAll(Request $request)
    {
        $needGoals = $request->input('goals', true);
        $needLinks = $request->input('links', true);
        $needComments = $request->input('comments', true);

        $to_load_eagerly = [];
        if ($needGoals){
            $to_load_eagerly[] = 'goals';
            $to_load_eagerly[] = 'goals.links';
            $to_load_eagerly[] = 'goals.links.user';
        }
        if ($needLinks){
            $to_load_eagerly[] = 'links';
            $to_load_eagerly[] = 'links.user';
        }
        if ($needComments){
            $to_load_eagerly[] = 'comments';
            $to_load_eagerly[] = 'comments.user';
        }
        
        try {
            $milestoneList = [];
            foreach (Milestone::with($to_load_eagerly)->where('user_id', $request->input('ruko_user'))->get() as $milestone) {
                $milestoneList[] = $milestone->toArray();
            }
            $resp = ["status" => "SUCCESS", "data" => $milestoneList];
            return response()->json($resp);
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
    }

    public function updateRuko(Request $request)
    {
       try {
            foreach (Milestone::get() as $milestone) {
                RukoMilestone::updateOrCreate($milestone);
            }
            $resp = ["status" => "SUCCESS", "data" => "Updated ruko milestone tables successfully."];
            return response()->json($resp);
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
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
            $milestone = Milestone::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "Milestone does not exist."]);
        }
        try {
            if ($request->has('user_id'))
                $milestone->user_id = $request->input('user_id');
            if ($request->has('name'))
                $milestone->name = $request->input('name');
            if ($request->has('category'))
                $milestone->category = $request->input('category');
            if ($request->has('subcategory'))
                $milestone->subcategory = $request->input('subcategory');
            if ($request->has('completed'))
                $milestone->completed = $request->input('completed');
            if ($request->has('template_id'))
                $milestone->template_id = $request->input('template_id');
            if ($request->has('inspirational_image_url'))
                $milestone->inspirational_image_url = $request->input('inspirational_image_url');
            if ($request->has('deadline'))
                $milestone->deadline = $request->input('deadline');
            if ($request->has('measure_data'))
                $milestone->measure_data = $request->input('measure_data');
            if ($request->has('start_measure'))
                $milestone->start_measure = $request->input('start_measure');
            if ($request->has('end_measure'))
                $milestone->end_measure = $request->input('end_measure');
            if ($request->has('vision'))
                $milestone->vision = $request->input('vision');
            if ($request->has('purpose'))
                $milestone->purpose = $request->input('purpose');
            if ($request->has('obstacles'))
                $milestone->obstacles = $request->input('obstacles');
            if ($request->has('notes'))
                $milestone->notes = $request->input('notes');
            if ($request->has('private'))
                $milestone->private = $request->input('private');
            if ($request->has('permissions'))
                $milestone->permissions = $request->input('permissions');

            $rm = RukoMilestone::updateOrCreate($milestone);
            $milestone->ruko_id_external = $rm->id;

            $milestone->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => "Updated milestone ".$id." successfully."]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $milestone = Milestone::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "Milestone does not exist."]);
        }
        RukoMilestone::destroy($milestone->ruko_id_external);
        Milestone::destroy($id);
        return response()->json(["status" => "SUCCESS", "data" => "Milestone ".$id." destroyed."]);
    }
}
