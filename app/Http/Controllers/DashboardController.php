<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use App\Models\Student;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $currentTime = Carbon::now();
        
        // Get current class (happening right now)
        $currentClass = ClassSchedule::with('student')
            ->where('class_date', $today)
            ->where('status', 'upcoming')
            ->where(function ($query) use ($currentTime) {
                // SQLite compatible time comparison
                $query->whereRaw('TIME(?) >= start_time', [$currentTime->format('H:i:s')])
                      ->whereRaw('TIME(?) < TIME(start_time, "+" || duration_minutes || " minutes")', [$currentTime->format('H:i:s')]);
            })
            ->first();
            
        // Get next upcoming class
        $nextClass = ClassSchedule::with('student')
            ->where(function ($query) use ($today, $currentTime) {
                $query->where('class_date', '>', $today)
                    ->orWhere(function ($q) use ($today, $currentTime) {
                        $q->where('class_date', $today)
                          ->whereRaw('start_time > TIME(?)', [$currentTime->format('H:i:s')]);
                    });
            })
            ->where('status', 'upcoming')
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->first();
            
        // Get today's classes
        $todaysClasses = ClassSchedule::with('student')
            ->where('class_date', $today)
            ->orderBy('start_time')
            ->get();
            
        // Get current month classes for calendar
        $startOfMonth = $currentTime->copy()->startOfMonth();
        $endOfMonth = $currentTime->copy()->endOfMonth();
        
        $monthlyClasses = ClassSchedule::with('student')
            ->whereBetween('class_date', [$startOfMonth, $endOfMonth])
            ->get()
            ->groupBy(function ($class) {
                return \Carbon\Carbon::parse($class->class_date)->format('Y-m-d');
            });
            
        // Get monthly completed classes count
        $monthlyCompletedClasses = ClassSchedule::whereBetween('class_date', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->count();
            
        // Get this week's completed classes
        $startOfWeek = $currentTime->copy()->startOfWeek();
        $endOfWeek = $currentTime->copy()->endOfWeek();
        
        $weeklyCompletedClasses = ClassSchedule::with('student')
            ->whereBetween('class_date', [$startOfWeek, $endOfWeek])
            ->where('status', 'completed')
            ->orderBy('class_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();
            
        // Calculate weekly earnings
        $weeklyEarnings = $weeklyCompletedClasses->sum(function ($class) {
            $hourlyRate = $class->student->hourly_rate ?? 0;
            $durationHours = $class->duration_minutes / 60;
            return $hourlyRate * $durationHours;
        });
        
        // Get statistics
        $stats = [
            'total_students' => Student::count(),
            'total_classes_today' => $todaysClasses->count(),
            'completed_classes_today' => $todaysClasses->where('status', 'completed')->count(),
            'upcoming_classes_today' => $todaysClasses->where('status', 'upcoming')->count(),
            'weekly_completed_classes' => $weeklyCompletedClasses->count(),
            'weekly_earnings' => $weeklyEarnings,
        ];
        
        return Inertia::render('dashboard', [
            'currentClass' => $currentClass,
            'nextClass' => $nextClass,
            'todaysClasses' => $todaysClasses,
            'weeklyCompletedClasses' => $weeklyCompletedClasses,
            'monthlyClasses' => $monthlyClasses,
            'monthlyCompletedClasses' => $monthlyCompletedClasses,
            'currentMonthName' => $currentTime->format('F'),
            'stats' => $stats,
            'currentMonth' => $currentTime->format('Y-m'),
        ]);
    }
}
