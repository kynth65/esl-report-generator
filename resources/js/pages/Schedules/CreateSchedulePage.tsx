import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect } from 'react';

interface Student {
    id: number;
    name: string;
}

interface CreateSchedulePageProps {
    students: Student[];
}

export default function CreateSchedulePage({ students }: CreateSchedulePageProps) {
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedStudentId = urlParams.get('student_id');

    const { data, setData, post, processing, errors } = useForm({
        student_id: preselectedStudentId || '',
        class_date: '',
        start_time: '',
        duration_minutes: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/schedules');
    };

    const durationOptions = [
        { value: '30', label: '30 minutes' },
        { value: '60', label: '1 hour' },
        { value: '90', label: '1.5 hours' },
        { value: '120', label: '2 hours' }
    ];

    // Set today as minimum date
    const today = new Date().toISOString().split('T')[0];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Calendar', href: '/calendar' },
            { title: 'Schedule Class', href: '/schedules/create' }
        ]}>
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <Link href="/calendar">
                                <Button variant="ghost" size="sm" className="mb-4">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Calendar
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Schedule New Class</h1>
                            <p className="text-gray-600 mt-2 text-base sm:text-lg">Add a new class to the schedule</p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card className="shadow-lg border-0 max-w-4xl mx-auto">
                        <CardHeader className="text-center pb-6">
                            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">Class Information</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 sm:px-12 py-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <Label htmlFor="student_id" className="text-base font-semibold text-gray-700">Student *</Label>
                                    <Select value={data.student_id} onValueChange={(value) => setData('student_id', value)}>
                                        <SelectTrigger className={`h-12 text-base ${errors.student_id ? 'border-red-500' : 'border-gray-300'}`}>
                                            <SelectValue placeholder="Select a student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {student.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.student_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.student_id}</p>
                                    )}
                                </div>

                                <div className="grid gap-8 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="class_date" className="text-base font-semibold text-gray-700">Date *</Label>
                                        <Input
                                            id="class_date"
                                            type="date"
                                            min={today}
                                            value={data.class_date}
                                            onChange={(e) => setData('class_date', e.target.value)}
                                            className={`h-12 text-base ${errors.class_date ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.class_date && (
                                            <p className="text-sm text-red-600 mt-1">{errors.class_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="start_time" className="text-base font-semibold text-gray-700">Start Time *</Label>
                                        <Input
                                            id="start_time"
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className={`h-12 text-base ${errors.start_time ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.start_time && (
                                            <p className="text-sm text-red-600 mt-1">{errors.start_time}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="duration_minutes" className="text-base font-semibold text-gray-700">Duration *</Label>
                                    <Select value={data.duration_minutes} onValueChange={(value) => setData('duration_minutes', value)}>
                                        <SelectTrigger className={`h-12 text-base ${errors.duration_minutes ? 'border-red-500' : 'border-gray-300'}`}>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {durationOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.duration_minutes && (
                                        <p className="text-sm text-red-600 mt-1">{errors.duration_minutes}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="notes" className="text-base font-semibold text-gray-700">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Optional notes about the class"
                                        rows={6}
                                        className={`resize-none text-base ${errors.notes ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                                    )}
                                </div>

                                {/* Time Conflict Warning */}
                                {(errors as any).time_conflict && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-800 text-sm font-semibold">Time Conflict</p>
                                        <p className="text-red-700 text-sm mt-1">{(errors as any).time_conflict}</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 h-12 text-base font-semibold"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        {processing ? 'Scheduling...' : 'Schedule Class'}
                                    </Button>
                                    <Link href="/calendar" className="flex-1 sm:flex-none">
                                        <Button type="button" variant="outline" className="w-full h-12 text-base">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}