<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql';
    protected $table = 'ld_comments';
    protected $guarded = [];

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toArrayRecursive()
    {
        $resp = $this->toArray();
        $resp["user"] = $this->user->toArrayRecursive();
        return $resp;
    }

}
