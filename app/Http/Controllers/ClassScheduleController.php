<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ClassScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ClassSchedule::with(['student:id,name,price_amount,duration_minutes'])
            ->orderBy('class_date', 'desc')
            ->orderBy('start_time', 'desc');

        if ($request->has('student_id') && $request->student_id !== 'all' && $request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('status') && $request->status !== 'all' && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->where('class_date', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->where('class_date', '<=', $request->date_to);
        }

        $classes = $query->paginate(20);
        $students = Student::select('id', 'name', 'price_amount', 'duration_minutes')->orderBy('name')->get();
        
        // Apply student filter to today's classes if filter is set
        $todaysQuery = ClassSchedule::with(['student:id,name,price_amount,duration_minutes'])
            ->where('class_date', Carbon::today()->format('Y-m-d'))
            ->orderBy('start_time');
            
        if ($request->has('student_id') && $request->student_id !== 'all' && $request->student_id) {
            $todaysQuery->where('student_id', $request->student_id);
        }
        
        $todaysClasses = $todaysQuery->get();
        
        // Get completed classes for current month (for calendar view)
        $currentMonth = Carbon::today()->format('Y-m');
        $monthStart = Carbon::createFromFormat('Y-m', $currentMonth)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $currentMonth)->endOfMonth();
        
        $monthlyCompletedQuery = ClassSchedule::where('status', 'completed')
            ->whereBetween('class_date', [$monthStart->format('Y-m-d'), $monthEnd->format('Y-m-d')]);
        
        if ($request->has('student_id') && $request->student_id !== 'all' && $request->student_id) {
            $monthlyCompletedQuery->where('student_id', $request->student_id);
        }
        
        $monthlyCompletedClasses = $monthlyCompletedQuery->count();
        $currentMonthName = $monthStart->format('F Y');
        
        // Get weekly earnings from completed classes
        $weeklyEarningsQuery = ClassSchedule::with(['student:id,name,price_amount,duration_minutes'])
            ->where('status', 'completed');
            
        if ($request->has('student_id') && $request->student_id !== 'all' && $request->student_id) {
            $weeklyEarningsQuery->where('student_id', $request->student_id);
        }
        
        $completedClasses = $weeklyEarningsQuery->orderBy('class_date', 'desc')->get();
        $weeklyEarnings = [];
        
        foreach ($completedClasses as $class) {
            // Calculate class earnings
            $classEarning = 0;
            if ($class->student->price_amount && $class->student->duration_minutes && $class->student->duration_minutes > 0) {
                $pricePerMinute = $class->student->price_amount / $class->student->duration_minutes;
                $classEarning = round($pricePerMinute * $class->duration_minutes, 2);
            }
            
            // Group by week (Monday to Sunday)
            $classDate = Carbon::parse($class->class_date);
            $monday = $classDate->copy()->startOfWeek(); // Carbon starts week on Monday
            $sunday = $monday->copy()->endOfWeek();
            $weekKey = $monday->format('Y-m-d');
            $weekLabel = $monday->format('M j') . ' - ' . $sunday->format('M j, Y');
            
            if (!isset($weeklyEarnings[$weekKey])) {
                $weeklyEarnings[$weekKey] = [
                    'week_start' => $monday->format('Y-m-d'),
                    'week_end' => $sunday->format('Y-m-d'),
                    'week_label' => $weekLabel,
                    'total_earnings' => 0,
                    'classes' => []
                ];
            }
            
            $weeklyEarnings[$weekKey]['total_earnings'] += $classEarning;
            $weeklyEarnings[$weekKey]['classes'][] = [
                'id' => $class->id,
                'student_name' => $class->student->name,
                'student_id' => $class->student->id,
                'class_date' => Carbon::parse($class->class_date)->format('M d, Y'),
                'start_time' => substr($class->start_time, 0, 5), // Get HH:MM format
                'duration_minutes' => $class->duration_minutes,
                'duration_hours' => $class->duration_hours,
                'notes' => $class->notes,
                'price' => $classEarning
            ];
        }
        
        // Sort weekly earnings by week start date (newest first)
        krsort($weeklyEarnings);

        return Inertia::render('calendar/index', [
            'classes' => $classes,
            'students' => $students,
            'todaysClasses' => $todaysClasses,
            'monthlyCompletedClasses' => $monthlyCompletedClasses,
            'currentMonthName' => $currentMonthName,
            'weeklyEarnings' => array_values($weeklyEarnings),
            'filters' => $request->only(['student_id', 'status', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $students = Student::select('id', 'name', 'price_amount', 'duration_minutes')->orderBy('name')->get();
        
        return Inertia::render('Schedules/CreateSchedulePage', [
            'students' => $students
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'duration_minutes' => 'required|in:25,50,60',
            'notes' => 'nullable|string'
        ]);

        // Check for time conflicts
        $startTime = Carbon::createFromFormat('H:i', $validated['start_time']);
        $endTime = $startTime->copy()->addMinutes((int) $validated['duration_minutes']);
        
        $conflict = ClassSchedule::where('class_date', $validated['class_date'])
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($q) use ($startTime) {
                    // SQLite compatible time comparison
                    $q->whereRaw('start_time <= ?', [$startTime->format('H:i:s')])
                      ->whereRaw('TIME(start_time, "+" || duration_minutes || " minutes") > ?', [$startTime->format('H:i:s')]);
                })
                ->orWhere(function ($q) use ($endTime) {
                    // SQLite compatible time comparison  
                    $q->whereRaw('start_time < ?', [$endTime->format('H:i:s')])
                      ->whereRaw('TIME(start_time, "+" || duration_minutes || " minutes") >= ?', [$endTime->format('H:i:s')]);
                });
            })
            ->exists();

        if ($conflict) {
            return back()->withErrors(['time_conflict' => 'This time slot conflicts with an existing class.']);
        }

        ClassSchedule::create($validated);

        return redirect()->route('calendar.index')->with('success', 'Class scheduled successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassSchedule $schedule)
    {
        $students = Student::select('id', 'name', 'price_amount', 'duration_minutes')->orderBy('name')->get();
        
        // Load the student relationship and ensure the data is properly formatted
        $schedule->load('student');
        
        return Inertia::render('Schedules/EditSchedulePage', [
            'classSchedule' => $schedule,
            'students' => $students
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClassSchedule $schedule)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'duration_minutes' => 'required|in:25,50,60',
            'status' => 'required|in:upcoming,completed,cancelled',
            'notes' => 'nullable|string'
        ]);

        $schedule->update($validated);

        return redirect()->route('calendar.index')->with('success', 'Class updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassSchedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('calendar.index')->with('success', 'Class deleted successfully!');
    }

    public function getCalendarData(Request $request)
    {
        $month = $request->get('month', Carbon::now()->format('Y-m'));
        $startDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $query = ClassSchedule::with(['student:id,name,price_amount,duration_minutes'])
            ->whereBetween('class_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);

        // Apply filters same as index method
        if ($request->has('student_id') && $request->student_id !== 'all' && $request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('status') && $request->status !== 'all' && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->where('class_date', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->where('class_date', '<=', $request->date_to);
        }

        $classes = $query->get()->groupBy(function ($class) {
            return $class->class_date;
        });

        // Get completed classes count for this month
        $completedQuery = ClassSchedule::where('status', 'completed')
            ->whereBetween('class_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);

        if ($request->has('student_id') && $request->student_id !== 'all' && $request->student_id) {
            $completedQuery->where('student_id', $request->student_id);
        }

        $completedCount = $completedQuery->count();
        $monthName = $startDate->format('F Y');

        return response()->json([
            'classes' => $classes,
            'completedCount' => $completedCount,
            'monthName' => $monthName
        ]);
    }
}
