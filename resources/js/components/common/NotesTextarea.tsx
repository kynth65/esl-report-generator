import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface NotesTextareaProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    rows?: number;
    className?: string;
}

export function NotesTextarea({
    label = "Additional Notes",
    placeholder = "Enter any additional information or specific requirements...",
    value,
    onChange,
    maxLength = 1000,
    rows = 4,
    className = ""
}: NotesTextareaProps) {
    const [isFocused, setIsFocused] = useState(false);
    const characterCount = value.length;

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor="notes-textarea" className="text-sm font-medium text-gray-700">
                {label} (Optional)
            </Label>
            
            <Card className={`transition-all duration-200 ${
                isFocused ? 'ring-2 ring-[#769fcd]/20 border-[#769fcd]' : 'border-[#d6e6f2]'
            }`}>
                <CardContent className="p-4">
                    <textarea
                        id="notes-textarea"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        rows={rows}
                        maxLength={maxLength}
                        className="w-full resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm leading-relaxed"
                        style={{ minHeight: `${rows * 1.5}rem` }}
                    />
                </CardContent>
            </Card>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Optional field - add any relevant context or special instructions</span>
                <span className={`${
                    characterCount > maxLength * 0.9 ? 'text-amber-600' : 
                    characterCount === maxLength ? 'text-red-600' : 'text-gray-400'
                }`}>
                    {characterCount}/{maxLength}
                </span>
            </div>
        </div>
    );
}