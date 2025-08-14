<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'name',
        'gender',
        'notes'
    ];

    protected $casts = [
        'gender' => 'string'
    ];

    public function classSchedules(): HasMany
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function upcomingClasses(): HasMany
    {
        return $this->hasMany(ClassSchedule::class)
            ->where('status', 'upcoming')
            ->where('class_date', '>=', now()->format('Y-m-d'))
            ->orderBy('class_date')
            ->orderBy('start_time');
    }
}
