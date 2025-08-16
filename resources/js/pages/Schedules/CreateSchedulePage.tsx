import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    price_amount?: number;
    duration_minutes?: number;
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
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/schedules');
    };

    const calculateClassCost = (): number => {
        if (!data.student_id || !data.duration_minutes) return 0;

        const selectedStudent = students.find((student) => student.id.toString() === data.student_id);
        if (!selectedStudent?.price_amount || !selectedStudent?.duration_minutes || selectedStudent.duration_minutes === 0) {
            return 0;
        }

        const pricePerMinute = selectedStudent.price_amount / selectedStudent.duration_minutes;
        return Math.round(pricePerMinute * Number(data.duration_minutes) * 100) / 100;
    };

    const durationOptions = [
        { value: '25', label: '25 minutes' },
        { value: '50', label: '50 minutes' },
        { value: '60', label: '1 hour' },
    ];

    // Set today as minimum date
    const today = new Date().toISOString().split('T')[0];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Calendar', href: '/calendar' },
                { title: 'Schedule Class', href: '/schedules/create' },
            ]}
        >
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Page Header with Back Button */}
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">Schedule New Class</h2>
                            <p className="mt-1 hidden text-sm text-gray-600 sm:mt-2 sm:block sm:text-base md:text-lg">
                                Add a new class to the schedule
                            </p>
                        </div>
                        <Link href="/calendar" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:w-auto sm:text-sm"
                            >
                                <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Back to Calendar</span>
                                <span className="sm:hidden">Back</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Form */}
                    <Card className="mx-auto max-w-4xl border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r pb-4 text-center sm:pb-6">
                            <CardTitle className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">Class Information</CardTitle>
                            <p className="mt-1 hidden text-sm text-gray-600 sm:mt-2 sm:block sm:text-base">
                                Fill in the details to schedule a new class
                            </p>
                        </CardHeader>
                        <CardContent className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-12">
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                <div className="space-y-2 sm:space-y-3">
                                    <Label htmlFor="student_id" className="text-sm font-semibold text-gray-700 sm:text-base">
                                        Student *
                                    </Label>
                                    <Select value={data.student_id} onValueChange={(value) => setData('student_id', value)}>
                                        <SelectTrigger
                                            className={`h-10 text-sm sm:h-12 sm:text-base ${errors.student_id ? 'border-red-500' : 'border-gray-300'}`}
                                        >
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
                                    {errors.student_id && <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8">
                                    <div className="space-y-2 sm:space-y-3">
                                        <Label htmlFor="class_date" className="text-sm font-semibold text-gray-700 sm:text-base">
                                            Date *
                                        </Label>
                                        <Input
                                            id="class_date"
                                            type="date"
                                            min={today}
                                            value={data.class_date}
                                            onChange={(e) => setData('class_date', e.target.value)}
                                            className={`h-10 text-sm sm:h-12 sm:text-base ${errors.class_date ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.class_date && <p className="mt-1 text-sm text-red-600">{errors.class_date}</p>}
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        <Label htmlFor="start_time" className="text-sm font-semibold text-gray-700 sm:text-base">
                                            Start Time *
                                        </Label>
                                        <Input
                                            id="start_time"
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className={`h-10 text-sm sm:h-12 sm:text-base ${errors.start_time ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    <Label htmlFor="duration_minutes" className="text-sm font-semibold text-gray-700 sm:text-base">
                                        Duration *
                                    </Label>
                                    <Select value={data.duration_minutes} onValueChange={(value) => setData('duration_minutes', value)}>
                                        <SelectTrigger
                                            className={`h-10 text-sm sm:h-12 sm:text-base ${errors.duration_minutes ? 'border-red-500' : 'border-gray-300'}`}
                                        >
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
                                    {errors.duration_minutes && <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>}
                                </div>

                                {/* Price Information */}
                                {data.student_id && data.duration_minutes && calculateClassCost() > 0 && (
                                    <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4">
                                        <h3 className="mb-2 text-sm font-semibold text-blue-800 sm:mb-3 sm:text-base">Class Cost Preview</h3>
                                        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                                            <span className="text-sm font-medium text-blue-700 sm:text-base">
                                                Price for {data.duration_minutes} minutes:
                                            </span>
                                            <span className="text-xl font-bold text-blue-900 sm:text-2xl">${calculateClassCost().toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 sm:space-y-3">
                                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 sm:text-base">
                                        Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Optional notes about the class"
                                        rows={4}
                                        className={`resize-none text-sm sm:text-base ${errors.notes ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {/* Time Conflict Warning */}
                                {(errors as any).time_conflict && (
                                    <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-3 sm:p-4">
                                        <p className="text-xs font-semibold text-red-800 sm:text-sm">⚠️ Time Conflict</p>
                                        <p className="mt-1 text-xs text-red-700 sm:text-sm">{(errors as any).time_conflict}</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-center sm:gap-4 sm:pt-8">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        size="sm"
                                        className="bg-[#2563eb] text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl sm:text-sm md:text-base"
                                    >
                                        <Save className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                                        {processing ? (
                                            <>
                                                <span className="hidden sm:inline">Scheduling...</span>
                                                <span className="sm:hidden">Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">Schedule Class</span>
                                                <span className="sm:hidden">Schedule</span>
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/calendar" className="flex-1 sm:flex-none">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:text-sm md:text-base"
                                        >
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
