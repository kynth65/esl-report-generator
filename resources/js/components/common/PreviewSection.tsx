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
        <div className={`space-y-4 ${className}`}>
            <Separator className="my-8" />
            
            <Card className="border-2 border-[#d6e6f2] shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#f7fbfc] to-[#d6e6f2] border-b border-[#d6e6f2]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Icon
                                name="FileText"
                                className="h-6 w-6 text-[#769fcd]"
                            />
                            <h3 className="text-xl font-semibold text-gray-800">
                                {title}
                            </h3>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="border-[#769fcd] text-[#769fcd] hover:bg-[#769fcd] hover:text-white"
                            >
                                <Icon
                                    name={isExpanded ? "ChevronUp" : "ChevronDown"}
                                    className="h-4 w-4 mr-1"
                                />
                                {isExpanded ? "Collapse" : "Expand"}
                            </Button>
                            
                            {onDownload && (
                                <Button
                                    onClick={onDownload}
                                    className="bg-[#769fcd] hover:bg-[#769fcd]/90 text-white"
                                    size="sm"
                                >
                                    <Icon
                                        name="Download"
                                        className="h-4 w-4 mr-2"
                                    />
                                    Download PDF
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                {isExpanded && (
                    <CardContent className="p-6">
                        <div className="bg-white rounded-lg border border-gray-200 min-h-[400px]">
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
                        className="bg-[#769fcd] hover:bg-[#769fcd]/90 text-white px-8"
                    >
                        <Icon
                            name="Download"
                            className="h-5 w-5 mr-2"
                        />
                        Download PDF Report
                    </Button>
                </div>
            )}
        </div>
    );
}