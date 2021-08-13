<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Milestone extends Model
{
    use SoftDeletes;  // See https://laravel.com/docs/8.x/eloquent#soft-deleting

    protected $connection = 'mysql';
    protected $table = 'ld_milestones'; // db table name
    protected $guarded = []; // For now, let every field be mass assignable (see https://laravel.com/docs/8.x/eloquent#mass-assignment)

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function links()
    {
        return $this->morphMany(Link::class, 'link_owner');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function toArrayRecursive($includeGoals = true, $includeLinks = true, $includeComments = true)
    {
        // Serializes to an array of the form fieldname -> value, but recurses on linked models
        $resp = $this->toArray();

        if ($includeGoals) {
            $resp["goals"] = $this->goals->map(function ($goal, $key) {
                return $goal->toArrayRecursive(true);
            });
        }
        if ($includeLinks) {
            $resp["links"] = $this->links->map(function ($link, $key) {
                return $link->toArrayRecursive();
            });
        }

        if ($includeComments) {
            $resp["comments"] = $this->comments->map(function ($comment, $key) {
                return $comment->toArrayRecursive();
            });
        }
        return $resp;
    }
}
