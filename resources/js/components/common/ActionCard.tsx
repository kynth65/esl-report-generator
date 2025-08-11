import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Icon } from '@/components/ui/icon';
import { type LucideIcon } from 'lucide-react';

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
            <Card className="relative h-full min-h-[300px] overflow-hidden border-2 bg-gradient-to-br from-[#f7fbfc] to-[#d6e6f2] hover:from-[#d6e6f2] hover:to-[#b9d7ea] transition-all duration-300 shadow-md hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-between h-full p-4 sm:p-6 text-center">
                    {/* Icon Section */}
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <span className="text-3xl sm:text-4xl" role="img" aria-label={title}>
                            {emoji}
                        </span>
                        <Icon
                            as={IconComponent}
                            className="h-6 w-6 sm:h-8 sm:w-8 text-[#769fcd] group-hover:text-white transition-colors"
                        />
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 space-y-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-white transition-colors line-clamp-2">
                            {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors line-clamp-4">
                            {description}
                        </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="mt-4 pt-2 w-full">
                        <span className="inline-flex items-center justify-center w-full px-3 py-2 sm:px-4 sm:py-2 bg-[#769fcd] text-white text-xs sm:text-sm font-medium rounded-lg group-hover:bg-white group-hover:text-[#769fcd] transition-all duration-300 border-2 border-[#769fcd]">
                            Get Started
                            <Icon
                                name="ChevronRight"
                                className="ml-1 h-3 w-3 sm:h-4 sm:w-4"
                            />
                        </span>
                    </div>
                </CardContent>
                
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#769fcd]/0 via-transparent to-transparent group-hover:from-[#769fcd]/20 transition-all duration-300" />
            </Card>
        </Link>
    );
}