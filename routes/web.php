<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Milestone;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/* Redirect all ourreach/index.php traffic to ruko side of things. Also the root path. */
Route::get('/ourreach/index.php', function(){
    return view('ruko');
});

Route::permanentRedirect('/', '/ourreach/index.php');

Route::get('/formtest', function () {
    return view('form-testing');
});

Route::match(['get', 'post'], '/dashboard', function (Request $request){
    return view('dashboard', ['ruko_user' => $request->input('ruko_user')]);
});

Route::match(['get', 'post'], '/milestones', function (Request $request){
    return view('milestone-listing', ['ruko_user' => $request->input('ruko_user')]);
});

Route::match(['get', 'post'], '/milestone/{id}', function (Request $request, $id){
    try {
        // $milestone = Milestone::findOrFail($id);
        return view('milestone-view', ['milestone_id' => $id, 'ruko_user' => $request->input('ruko_user')]);
    } catch (ModelNotFoundException $e) {
        return view('not-found');
    } catch (\Exception $e) {
        return view('not-found');
    }
});

Route::match(['get', 'post'], '/ruko/milestone/{ruko_id}', function (Request $request, $ruko_id){
    try {
        /*
        if ($request->has('passwordHash')){
            $password_hash = $request->input('passwordHash');
        }else{
            $password_hash = $request->cookie('password_hash');
        }
        if ($request->has('userEmail')){
            $user_email = $request->input('userEmail');
        }else{
            $user_email = $request->cookie('user_email');
        } 
        */
        $milestone = Milestone::where('ruko_id_external', $ruko_id)->firstOrFail();

        return view('milestone-view', ['milestone_id' => $milestone->id, 'ruko_user' => $request->input('ruko_user')]);

        /*
        return $resp->cookie('password_hash', $password_hash, 24*60)
                    ->cookie('user_email', $user_email, 24*60);
        */
    } catch (ModelNotFoundException $e) {
        return view('not-found');
    } catch (\Exception $e) {
        return view('not-found');
    }
});

Route::get('/log/reset', function () {
    return file_get_contents("../log/reset_goals.txt");
});

