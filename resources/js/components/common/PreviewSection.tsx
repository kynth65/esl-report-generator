import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

interface PreviewSectionProps {
    title: string;
    isVisible: boolean;
    onDownload?: () => void;
    children: React.ReactNode;
    className?: string;
}

export function PreviewSection({
    title,
    isVisible,
    onDownload,
    children,
    className = ""
}: PreviewSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!isVisible) return null;

    return (
        <div className={`space-y-4 w-full ${className}`}>
            <Separator className="my-6 sm:my-8" />
            
            <Card className="border-2 border-[#d6e6f2] shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-[#f7fbfc] to-[#d6e6f2] border-b-2 border-[#d6e6f2] p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <Icon
                                name="FileText"
                                className="h-5 w-5 sm:h-6 sm:w-6 text-[#769fcd] flex-shrink-0"
                            />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                                {title}
                            </h3>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-2 flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="border-2 border-[#769fcd] text-[#769fcd] hover:bg-[#769fcd] hover:text-white transition-all duration-200 min-w-[100px]"
                            >
                                <Icon
                                    name={isExpanded ? "ChevronUp" : "ChevronDown"}
                                    className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                                />
                                {isExpanded ? "Collapse" : "Expand"}
                            </Button>
                            
                            {onDownload && (
                                <Button
                                    onClick={onDownload}
                                    className="bg-[#769fcd] hover:bg-[#769fcd]/90 text-white border-2 border-[#769fcd] transition-all duration-200 hidden sm:inline-flex"
                                    size="sm"
                                >
                                    <Icon
                                        name="Download"
                                        className="h-3 w-3 sm:h-4 sm:w-4 mr-2"
                                    />
                                    Download PDF
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                {isExpanded && (
                    <CardContent className="p-4 sm:p-6">
                        <div className="bg-white rounded-lg border-2 border-gray-200 min-h-[300px] sm:min-h-[400px] shadow-sm">
                            {children}
                        </div>
                    </CardContent>
                )}
            </Card>
            
            {/* Preview Actions Footer */}
            {isExpanded && onDownload && (
                <div className="flex justify-center pt-4">
                    <Button
                        onClick={onDownload}
                        size="lg"
                        className="bg-[#769fcd] hover:bg-[#769fcd]/90 text-white px-6 sm:px-8 py-3 border-2 border-[#769fcd] transition-all duration-200 w-full sm:w-auto"
                    >
                        <Icon
                            name="Download"
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                        />
                        Download PDF Report
                    </Button>
                </div>
            )}
        </div>
    );
}