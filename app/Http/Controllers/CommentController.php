<?php

namespace App\Http\Controllers;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;

class CommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $comment = new Comment;
            /* Required */
            $comment->user_id = $request->input('user_id');
            $comment->milestone_id = $request->input('milestone_id');
            $comment->comment_text = $request->input('comment_text');
            $comment->last_edited = Carbon::now()->setTimezone('UTC')->toDateTimeString();
            /* Optional */
            $comment->permissions = $request->input('permissions', json_encode([]));
            $comment->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => $comment->toArrayRecursive()]);
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
            $comment = Comment::findOrFail($id);
            return response()->json(["status" => "SUCCESS", "data" => $comment->toArrayRecursive()]);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "FAILURE", "data" => "Comment does not exist."]);
        }
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
        $validator = Validator::make($request->all(), ["comment_text" => "sometimes|min:1"]);
        $errors = $validator->errors()->first();
        if ($validator->fails()){
            return response()->json(["status" => "FAILURE", "data" => $errors]);
        }

        try {
            $comment = Comment::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(["status" => "EXCEPTION", "data" => "Comment does not exist."]);
        }
        try {
            if ($request->has('user_id'))
                $comment->user_id = $request->input('user_id');
            if ($request->has('milestone_id'))
                $comment->milestone_id = $request->input('milestone_id');
            if ($request->has('comment_text'))
                $comment->comment_text = $request->input('comment_text');
            
            $comment->last_edited = Carbon::now()->setTimezone('UTC')->toDateTimeString();
            if ($request->has('permissions'))
                $comment->permissions = $request->input('permissions');
            $comment->save();
        } catch (\Exception $e) {
            return response()->json(["status" => "EXCEPTION", "data" => $e->getMessage()]);
        }
        return response()->json(["status" => "SUCCESS", "data" => $comment->toArrayRecursive()]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Comment::destroy($id);
        return response()->json(["status" => "SUCCESS", "data" => "Comment ".$id." destroyed."]);
    }
}
