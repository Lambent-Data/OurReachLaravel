<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Link extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql';
    protected $table = 'ld_links';
    protected $guarded = [];

    /* Polymorphic one-to-many relationship (google it) */

    public function linkOwner()
    {
        return $this->morphTo();
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toArrayRecursive($includeUser = true)
    {
        // Serializes to an array of the form fieldname -> value, but recurses on linked models
        $resp = $this->toArray();

        if ($includeUser) {
            $resp["user"] = $this->user->toArray();
        }

        return $resp;
    }
}
