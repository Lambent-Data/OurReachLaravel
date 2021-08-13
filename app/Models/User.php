<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $connection = 'ruko_mysql';
    protected $table = 'app_entity_1';
    protected $guarded = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    protected $appends = ['image'];

    public function getImageAttribute()
    {
        return sha1($this->field_10);
    }

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function links()
    {
        return $this->hasMany(Link::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function toArrayRecursive()
    {
        return $this->toArray();
    }
    
}
