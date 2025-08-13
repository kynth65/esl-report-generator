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
        $query = ClassSchedule::with('student')
            ->orderBy('class_date', 'desc')
            ->orderBy('start_time', 'desc');

        if ($request->has('student_id') && $request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->where('class_date', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->where('class_date', '<=', $request->date_to);
        }

        $classes = $query->paginate(20);
        $students = Student::orderBy('name')->get();
        $todaysClasses = ClassSchedule::with('student')
            ->where('class_date', Carbon::today())
            ->orderBy('start_time')
            ->get();

        return Inertia::render('calendar/index', [
            'classes' => $classes,
            'students' => $students,
            'todaysClasses' => $todaysClasses,
            'filters' => $request->only(['student_id', 'status', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
            'duration_minutes' => 'required|in:30,60,90,120',
            'notes' => 'nullable|string'
        ]);

        // Check for time conflicts
        $startTime = Carbon::createFromFormat('H:i', $validated['start_time']);
        $endTime = $startTime->copy()->addMinutes($validated['duration_minutes']);
        
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClassSchedule $classSchedule)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'duration_minutes' => 'required|in:30,60,90,120',
            'status' => 'required|in:upcoming,completed,cancelled',
            'notes' => 'nullable|string'
        ]);

        $classSchedule->update($validated);

        return redirect()->route('calendar.index')->with('success', 'Class updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassSchedule $classSchedule)
    {
        $classSchedule->delete();

        return redirect()->route('calendar.index')->with('success', 'Class deleted successfully!');
    }

    public function getCalendarData(Request $request)
    {
        $month = $request->get('month', Carbon::now()->format('Y-m'));
        $startDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $classes = ClassSchedule::with('student')
            ->whereBetween('class_date', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($class) {
                return $class->class_date->format('Y-m-d');
            });

        return response()->json($classes);
    }
}
