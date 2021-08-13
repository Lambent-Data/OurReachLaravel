<?php

namespace App\Http\Controllers;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function retrieve(Request $request, $id)
    {
        try {
            /*if ($request->has('milestones') && $request->input('milestones')){
                $user = User::with(['milestones', 'milestones.goals', 'milestones.goals.links', 'milestones.links', 'milestones.comments', 'milestones.comments.user'])->where('id', $id)->firstOrFail();
            }else{
                $user = User::where('id', $id)->firstOrFail();
            }*/
            $user = User::findOrFail($id);
            return response()->json(["status" => "SUCCESS", "data" => $user->toArrayRecursive()]);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "User does not exist."]);
        }
    }

    public function retrieveAllAssigned(Request $request)
    {
        $id = $request->input('ruko_user');
        try {
            $user = User::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "User $id not found."]);
        }
        try {
            if ($user->field_6 == config('ruko.user_group_codes.admin') || $user->field_6 == config('ruko.user_group_codes.yl_admin')){
                // For admins, show all users
                $to_load_eagerly = [
                    'milestones' => function($query) {

                        $query->with([
                                'goals' => function ($query) {
                                    $query->with('links')->where('private', 0);
                                },
                                'links' => function ($query) {
                                    $query;
                                }]);
                    }];
                $assigned = User::with($to_load_eagerly)->where('field_6', config('ruko.user_group_codes.parent'))->get();

                return response()->json(["status" => "SUCCESS", "data" => $assigned->toArray()]);
            }else{
                // Otherwise just show assigned
                $to_load_eagerly = [
                    'milestones' => function($query) use ($id) {

                        $query->with([
                                'goals' => function ($query) {
                                    $query->with('links')->where('private', 0);
                                },
                                'links'
                            ]);
                    }];
                $assigned = User::with($to_load_eagerly)->where('field_1098', $id)->get();

                return response()->json(["status" => "SUCCESS", "data" => $assigned->toArray()]);
            }
        } catch (\Exception $e) {
            return response()->json(["status" => "FAILURE", "data" => "Exception in retrieveAllAssigned: ".$e->getMessage()]);
        }
    }
}
