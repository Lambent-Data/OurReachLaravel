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

class LinkController extends Controller
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
            $link = new Link;
            /* Required */
            $link->name = $request->input('name');
            $link->url = $request->input('url');
            $link->user_id = $request->input('user_id');
            /* Optional */
            $link->link_owner_id = $request->input('link_owner_id', null);
            if ($request->input('link_owner_type') == "App\Models\Milestone"){
                $link->link_owner_type = Milestone::class;
            } else if ($request->input('link_owner_type') == "App\Models\Goal"){
                $link->link_owner_type = Goal::class;
            }
            $link->origin = $request->input('origin', 'user');
            $link->hidden = $request->input('hidden', false);
            $link->notes = $request->input('notes', '');
            $link->permissions = $request->input('permissions', json_encode([]));
            $link->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => $link->toArrayRecursive()]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return "Here is the view page for Link ".$id;
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
            $link = Link::findOrFail($id);
            return response()->json(["status" => "SUCCESS", "data" => $link->toArray()]);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "Link does not exist."]);
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
            $link = Link::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "EXCEPTION", "data" => "Link does not exist."]);
        }
        try {
            if ($request->has('name'))
                $link->name = $request->input('name');
            if ($request->has('url'))
                $link->url = $request->input('url');
            if ($request->has('user_id'))
                $link->user_id = $request->input('user_id');
            if ($request->has('milestone_id'))
                $link->milestone_id = $request->input('milestone_id');
            if ($request->has('origin'))
                $link->origin = $request->input('origin');
            if ($request->has('hidden'))
                $link->hidden = $request->input('hidden');
            if ($request->has('notes'))
                $link->notes = $request->input('notes');
            if ($request->has('permissions'))
                $link->permissions = $request->input('permissions');
            $link->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => "Updated link ".$id." successfully."]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Link::destroy($id);
        return response()->json(["status" => "SUCCESS", "data" => "Link ".$id." destroyed."]);
    }
}
