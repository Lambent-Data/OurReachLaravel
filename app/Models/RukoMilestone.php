<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use App\Models\Milestone;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;



class RukoMilestone extends Model
{
    protected $connection = 'ruko_mysql';
    protected $table = 'app_entity_83'; // db table name
    protected $guarded = [];
    public $timestamps = false;

    protected $attributes = [
        'field_1000' => "",
        'field_1002' => "",
        'field_1003' => "",
        'field_1004' => "",
        'field_1005' => "",
        'field_1006' => "",
        'field_1007' => "",
        'field_1008' => "",
        'field_1013' => "",
        'field_1017' => "",
        'field_1018' => "",
        'field_1019' => "",
        'field_1029' => "",
        'field_1030' => "",
        'field_1031' => "",
        'field_1032' => "",
        'field_1033' => "",
        'field_1041' => "",
        'field_1049' => "",
        'field_1052' => "",
        'field_1053' => "",
        'field_1056' => "",
        'field_1065' => "",
        'field_1066' => "",
        'field_1118' => "",
        'field_1135' => "",
        'field_1144' => "",
        'field_1145' => "",
        'field_1146' => "",
        'field_1147' => "",
        'field_1150' => "",
        'field_1151' => "",
        'field_1171' => "",
        'field_995' => 0,
        'field_996' => 0,
        'field_997' => "",
        'field_998' => "",
        'field_999' => "",
    ];

    public static function updateOrCreate(Milestone $milestone){
        if (isset($milestone->ruko_id_external)){
            try {
                $rm = RukoMilestone::findOrFail($milestone->ruko_id_external);
            } catch (ModelNotFoundException $e) {
                $rm = new RukoMilestone;
            }
        }else{
            $rm = new RukoMilestone;
            $rm->date_added = Carbon::now()->timestamp;
        }
        if (isset($milestone->id))
            $rm->field_1171 = $milestone->id;
        if (isset($milestone->user_id))
            $rm->field_1013 = $milestone->user_id;
            $rm->field_1135 = $milestone->user->field_1098; // Set mentor to mentor of parent
            $rm->created_by = $milestone->user_id;
        if (isset($milestone->name))
            $rm->field_1002 = $milestone->name;
        if (isset($milestone->category))
            $rm->field_1065 = $milestone->category;
        if (isset($milestone->subcategory))
            $rm->field_1066 = $milestone->subcategory;
        if (isset($milestone->completed))
            $rm->field_1008 = $milestone->completed ? 103 : 104;
        if (isset($milestone->private))
            $rm->field_1004 = $milestone->private;
        $rm->date_updated = Carbon::now()->timestamp;
        $rm->save();
        // Update milestone values table also, because Ruko is silly and keeps this info in two tables
        if ($rm->field_1013){
            DB::connection('ruko_mysql')->table('app_entity_83_values')->updateOrInsert(
                ['items_id' => $rm->id, 'fields_id' => 1013], ['value' => $rm->field_1013]);
        }
        if ($rm->field_1135){
        DB::connection('ruko_mysql')->table('app_entity_83_values')->updateOrInsert(
            ['items_id' => $rm->id, 'fields_id' => 1135], ['value' => $rm->field_1135]);
        }
        return $rm;

    }
}
