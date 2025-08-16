import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    gender: 'male' | 'female' | 'other';
    notes?: string;
    price_amount?: number;
    duration_minutes?: number;
}

interface EditStudentPageProps {
    student: Student;
}

export default function EditStudentPage({ student }: EditStudentPageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: student.name,
        gender: student.gender,
        notes: student.notes || '',
        price_amount: student.price_amount?.toString() || '',
        duration_minutes: student.duration_minutes?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/students/${student.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Students', href: '/students' },
                { title: student.name, href: `/students/${student.id}` },
                { title: 'Edit', href: `/students/${student.id}/edit` },
            ]}
        >
            <Head title={`Edit ${student.name}`} />
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Page Header with Back Button */}
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">Edit Student</h2>
                            <p className="mt-1 hidden text-sm text-gray-600 sm:mt-2 sm:block sm:text-base md:text-lg">
                                Update {student.name}'s profile information
                            </p>
                        </div>
                        <Link href={`/students/${student.id}`} className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:w-auto sm:text-sm"
                            >
                                <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Back to Student</span>
                                <span className="sm:hidden">Back</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Form */}
                    <Card className="mx-auto max-w-4xl border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r pb-4 text-center sm:pb-6">
                            <CardTitle className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">Student Information</CardTitle>
                            <p className="mt-1 hidden text-sm text-gray-600 sm:mt-2 sm:block sm:text-base">
                                Update {student.name}'s profile details
                            </p>
                        </CardHeader>
                        <CardContent className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-12">
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8">
                                    <div className="space-y-2 sm:space-y-3">
                                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 sm:text-base">
                                            Student Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter student's full name"
                                            className={`h-10 text-sm sm:h-12 sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 sm:text-base">
                                            Gender *
                                        </Label>
                                        <Select
                                            value={data.gender}
                                            onValueChange={(value) => setData('gender', value as 'male' | 'female' | 'other')}
                                        >
                                            <SelectTrigger className={`h-10 text-sm sm:h-12 sm:text-base ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        <Label htmlFor="price_amount" className="text-sm font-semibold text-gray-700 sm:text-base">
                                            Price Amount ($)
                                        </Label>
                                        <Input
                                            id="price_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price_amount}
                                            onChange={(e) => setData('price_amount', e.target.value)}
                                            placeholder="Enter price amount (e.g., 5.00)"
                                            className={`h-10 text-sm sm:h-12 sm:text-base ${errors.price_amount ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.price_amount && <p className="mt-1 text-sm text-red-600">{errors.price_amount}</p>}
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        <Label htmlFor="duration_minutes" className="text-sm font-semibold text-gray-700 sm:text-base">
                                            Duration (minutes)
                                        </Label>
                                        <Select value={data.duration_minutes} onValueChange={(value) => setData('duration_minutes', value)}>
                                            <SelectTrigger className={`h-10 text-sm sm:h-12 sm:text-base ${errors.duration_minutes ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="25">25 minutes</SelectItem>
                                                <SelectItem value="50">50 minutes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.duration_minutes && <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>}
                                    </div>
                                </div>

                                {/* Price Information */}
                                {data.price_amount && data.duration_minutes && (
                                    <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4">
                                        <h3 className="mb-2 text-sm font-semibold text-blue-800 sm:mb-3 sm:text-base">Pricing Preview</h3>
                                        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                                            <span className="text-sm font-medium text-blue-700 sm:text-base">
                                                Rate per minute: ${(parseFloat(data.price_amount) / parseFloat(data.duration_minutes)).toFixed(4)}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-blue-700 sm:text-sm">
                                            <strong>Example:</strong> A 50-minute class would cost ${((parseFloat(data.price_amount) / parseFloat(data.duration_minutes)) * 50).toFixed(2)}
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
                                        placeholder="Additional notes about the student (optional)"
                                        rows={4}
                                        className={`resize-none text-sm sm:text-base ${errors.notes ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

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
                                                <span className="hidden sm:inline">Updating...</span>
                                                <span className="sm:hidden">Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">Update Student</span>
                                                <span className="sm:hidden">Update</span>
                                            </>
                                        )}
                                    </Button>
                                    <Link href={`/students/${student.id}`} className="flex-1 sm:flex-none">
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
