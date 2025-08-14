<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'name',
        'gender',
        'notes',
        'price_amount',
        'duration_minutes'
    ];

    protected $casts = [
        'gender' => 'string',
        'price_amount' => 'decimal:2',
        'duration_minutes' => 'integer'
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

    public function calculateClassCost(int $classDurationMinutes): float
    {
        if (!$this->price_amount || !$this->duration_minutes || $this->duration_minutes == 0) {
            return 0.0;
        }
        
        $pricePerMinute = $this->price_amount / $this->duration_minutes;
        return round($pricePerMinute * $classDurationMinutes, 2);
    }
}
