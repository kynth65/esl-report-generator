import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface Student {
    id: number;
    name: string;
}

interface FilterData {
    student_id: string;
    status: string;
    date_from: string;
    date_to: string;
}

interface ClassFiltersProps {
    students: Student[];
    filterData: FilterData;
    onFilterChange: (key: keyof FilterData, value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    isProcessing?: boolean;
}

export default function ClassFilters({
    students,
    filterData,
    onFilterChange,
    onApplyFilters,
    onClearFilters,
    isProcessing = false,
}: ClassFiltersProps) {
    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    <div className="space-y-2 sm:space-y-3">
                        <label className="text-sm font-semibold text-gray-700 sm:text-base">Student</label>
                        <Select
                            value={filterData.student_id}
                            onValueChange={(value) => onFilterChange('student_id', value)}
                        >
                            <SelectTrigger className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base">
                                <SelectValue placeholder="All students" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All students</SelectItem>
                                {students.map((student) => (
                                    <SelectItem key={student.id} value={student.id.toString()}>
                                        {student.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        <label className="text-sm font-semibold text-gray-700 sm:text-base">Status</label>
                        <Select value={filterData.status} onValueChange={(value) => onFilterChange('status', value)}>
                            <SelectTrigger className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        <label className="text-sm font-semibold text-gray-700 sm:text-base">From Date</label>
                        <Input
                            type="date"
                            value={filterData.date_from}
                            onChange={(e) => onFilterChange('date_from', e.target.value)}
                            className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base"
                        />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        <label className="text-sm font-semibold text-gray-700 sm:text-base">To Date</label>
                        <Input
                            type="date"
                            value={filterData.date_to}
                            onChange={(e) => onFilterChange('date_to', e.target.value)}
                            className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base"
                        />
                    </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3 sm:mt-6 sm:gap-3 sm:pt-4">
                    <Button
                        onClick={onApplyFilters}
                        disabled={isProcessing}
                        size="sm"
                        className="flex-1 bg-[#2563eb] text-xs text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl sm:flex-none sm:text-sm"
                    >
                        <Filter className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Apply Filters</span>
                        <span className="sm:hidden">Apply</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        size="sm"
                        className="flex-1 border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:flex-none sm:text-sm"
                    >
                        Clear
                    </Button>
                </div>
        </div>
    );
}