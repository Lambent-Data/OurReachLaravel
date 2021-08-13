<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MilestoneController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* These routes are prefixed with "/api" automatically in the URL.
 *
 * 
 */

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::match(['get', 'post'], '/showrequest', function (Request $request){
    return json_encode($request);
});

Route::match(['get', 'post'], '/echo', function (Request $request){
    return $_POST ? json_encode($_POST) : json_encode($_GET);
});

Route::get('/cookies', function (Request $request){
    return json_encode($_COOKIE);
});

Route::get('/updateRuko', [MilestoneController::class, 'updateRuko']);

Route::get('/currentuser', function (Request $request){
    return $request->input('ruko_user');
});

Route::get('/milestone/retrieve', [MilestoneController::class, 'retrieveAll']);

Route::get('/milestone/retrieve/{id}', [MilestoneController::class, 'retrieve']);
Route::get('/goal/retrieve/{id}', [GoalController::class, 'retrieve']);
Route::get('/link/retrieve/{id}', [LinkController::class, 'retrieve']);
Route::get('/comment/retrieve/{id}', [CommentController::class, 'retrieve']);

Route::get('/user/retrieve/{id}', [UserController::class, 'retrieve']);
Route::get('/user/retrieveAllAssigned', [UserController::class, 'retrieveAllAssigned']);

Route::resource('milestone', MilestoneController::class);
Route::resource('goal', GoalController::class);
Route::resource('link', LinkController::class);
Route::resource('comment', CommentController::class);