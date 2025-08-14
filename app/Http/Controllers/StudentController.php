<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

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
            'notes' => 'nullable|string'
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

        return Inertia::render('Students/StudentDetailPage', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'gender' => $student->gender,
                'notes' => $student->notes,
                'created_at' => $student->created_at->format('M d, Y'),
                'classes' => $student->classSchedules->map(function ($class) {
                    return [
                        'id' => $class->id,
                        'class_date' => $class->class_date->format('M d, Y'),
                        'start_time' => $class->start_time,
                        'duration_minutes' => $class->duration_minutes,
                        'duration_hours' => $class->duration_hours,
                        'status' => $class->status,
                        'notes' => $class->notes
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
                'notes' => $student->notes
            ]
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'notes' => 'nullable|string'
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
