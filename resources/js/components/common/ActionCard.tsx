import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Icon } from '@/components/ui/icon';
import { type LucideIcon, ChevronRight } from 'lucide-react';

interface ActionCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    emoji: string;
}

export function ActionCard({ title, description, href, icon: IconComponent, emoji }: ActionCardProps) {
    return (
        <Link
            href={href}
            className="group relative block transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
        >
            <Card className="relative h-[400px] w-full overflow-hidden border border-gray-200 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#f8fafc] transition-all duration-300 shadow-sm hover:shadow-lg hover:border-[#2563eb]/30">
                <CardContent className="flex flex-col h-full p-6 text-center">
                    {/* Icon Section */}
                    <div className="flex justify-center items-center space-x-3 mb-6">
                        <span className="text-3xl sm:text-4xl" role="img" aria-label={title}>
                            {emoji}
                        </span>
                        <Icon
                            iconNode={IconComponent}
                            className="h-7 w-7 sm:h-8 sm:w-8 text-[#2563eb] group-hover:text-[#10b981] transition-colors"
                        />
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                            {description}
                        </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="mt-6 w-full">
                        <span className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white text-sm font-medium rounded-lg group-hover:from-[#1d4ed8] group-hover:to-[#3b82f6] transition-all duration-300 shadow-sm hover:shadow-md">
                            Get Started
                            <Icon
                                iconNode={ChevronRight}
                                className="ml-2 h-4 w-4"
                            />
                        </span>
                    </div>
                </CardContent>
                
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] group-hover:h-2 transition-all duration-300" />
            </Card>
        </Link>
    );
}