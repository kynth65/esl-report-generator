<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('upcomingClasses')
            ->withCount('classSchedules')
            ->orderBy('name')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'gender' => $student->gender,
                    'notes' => $student->notes,
                    'price_amount' => $student->price_amount,
                    'duration_minutes' => $student->duration_minutes,
                    'classes_count' => $student->class_schedules_count,
                    'upcoming_classes_count' => $student->upcomingClasses->count(),
                    'created_at' => $student->created_at->format('M d, Y')
                ];
            });

        return Inertia::render('Students/StudentsPage', [
            'students' => $students
        ]);
    }

    public function create()
    {
        return Inertia::render('Students/CreateStudentPage');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'notes' => 'nullable|string',
            'price_amount' => 'nullable|numeric|min:0|max:999999.99',
            'duration_minutes' => 'nullable|integer|min:1|max:1440'
        ]);

        Student::create($validated);

        return redirect()->route('students.index')
            ->with('message', 'Student created successfully!');
    }

    public function show(Student $student)
    {
        $student->load(['classSchedules' => function ($query) {
            $query->orderBy('class_date', 'desc')
                  ->orderBy('start_time', 'desc');
        }]);

        // Calculate total earnings from completed classes
        $totalEarnings = 0;
        $thisMonthEarnings = 0;
        $currentMonth = now()->format('Y-m');
        $weeklyEarnings = [];

        if ($student->price_amount && $student->duration_minutes && $student->duration_minutes > 0) {
            $pricePerMinute = $student->price_amount / $student->duration_minutes;
            
            foreach ($student->classSchedules as $class) {
                if ($class->status === 'completed') {
                    $classEarning = round($pricePerMinute * $class->duration_minutes, 2);
                    $totalEarnings += $classEarning;
                    
                    // Check if class is from current month
                    $classDateCarbon = Carbon::parse($class->class_date);
                    if ($classDateCarbon->format('Y-m') === $currentMonth) {
                        $thisMonthEarnings += $classEarning;
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
                        'class_date' => Carbon::parse($class->class_date)->format('M d, Y'),
                        'start_time' => $class->start_time,
                        'duration_minutes' => $class->duration_minutes,
                        'duration_hours' => $class->duration_hours,
                        'notes' => $class->notes,
                        'price' => $classEarning
                    ];
                }
            }
        }
        
        // Sort weekly earnings by week start date (newest first)
        krsort($weeklyEarnings);

        return Inertia::render('Students/StudentDetailPage', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'gender' => $student->gender,
                'notes' => $student->notes,
                'price_amount' => $student->price_amount,
                'duration_minutes' => $student->duration_minutes,
                'created_at' => $student->created_at->format('M d, Y'),
                'total_earnings' => $totalEarnings,
                'this_month_earnings' => $thisMonthEarnings,
                'current_month_name' => now()->format('F Y'),
                'weekly_earnings' => array_values($weeklyEarnings),
                'classes' => $student->classSchedules->map(function ($class) use ($student) {
                    $classPrice = 0;
                    if ($student->price_amount && $student->duration_minutes && $student->duration_minutes > 0) {
                        $pricePerMinute = $student->price_amount / $student->duration_minutes;
                        $classPrice = round($pricePerMinute * $class->duration_minutes, 2);
                    }
                    
                    return [
                        'id' => $class->id,
                        'class_date' => Carbon::parse($class->class_date)->format('M d, Y'),
                        'start_time' => $class->start_time,
                        'duration_minutes' => $class->duration_minutes,
                        'duration_hours' => $class->duration_hours,
                        'status' => $class->status,
                        'notes' => $class->notes,
                        'price' => $classPrice
                    ];
                })
            ]
        ]);
    }

    public function edit(Student $student)
    {
        return Inertia::render('Students/EditStudentPage', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'gender' => $student->gender,
                'notes' => $student->notes,
                'price_amount' => $student->price_amount,
                'duration_minutes' => $student->duration_minutes
            ]
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'notes' => 'nullable|string',
            'price_amount' => 'nullable|numeric|min:0|max:999999.99',
            'duration_minutes' => 'nullable|integer|min:1|max:1440'
        ]);

        $student->update($validated);

        return redirect()->route('students.index')
            ->with('message', 'Student updated successfully!');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('students.index')
            ->with('message', 'Student deleted successfully!');
    }
}
