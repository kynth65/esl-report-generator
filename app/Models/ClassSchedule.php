<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ClassSchedule extends Model
{
    protected $fillable = [
        'student_id',
        'class_date',
        'start_time',
        'duration_minutes',
        'status',
        'notes'
    ];

    protected $casts = [
        'class_date' => 'date',
        'duration_minutes' => 'integer'
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    // Custom accessor for class_date to prevent timezone issues
    public function getClassDateAttribute($value)
    {
        return $value; // Return as-is to avoid timezone conversion
    }

    // Custom mutator for class_date to ensure it's stored as pure date
    public function setClassDateAttribute($value)
    {
        $this->attributes['class_date'] = $value;
    }

    public function getEndTimeAttribute(): string
    {
        $startTime = Carbon::createFromFormat('H:i', substr($this->start_time, 0, 5));
        return $startTime->addMinutes($this->duration_minutes)->format('H:i');
    }

    public function getDurationHoursAttribute(): string
    {
        return match ($this->duration_minutes) {
            30 => '0.5 hour',
            60 => '1 hour',
            90 => '1.5 hours',
            120 => '2 hours',
            default => $this->duration_minutes . ' minutes'
        };
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'upcoming')
            ->where('class_date', '>=', now()->format('Y-m-d'));
    }

    public function scopeToday($query)
    {
        return $query->where('class_date', now()->format('Y-m-d'));
    }
}
