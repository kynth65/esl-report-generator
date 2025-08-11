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
            className="group relative transition-all duration-200 hover:scale-105"
        >
            <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-[#f7fbfc] to-[#d6e6f2] hover:from-[#d6e6f2] hover:to-[#b9d7ea] transition-all duration-300">
                <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center items-center space-x-2">
                        <span className="text-4xl" role="img" aria-label={title}>
                            {emoji}
                        </span>
                        <Icon
                            as={IconComponent}
                            className="h-8 w-8 text-[#769fcd] group-hover:text-white transition-colors"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-white transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors">
                            {description}
                        </p>
                    </div>
                    
                    <div className="pt-2">
                        <span className="inline-flex items-center px-4 py-2 bg-[#769fcd] text-white text-sm font-medium rounded-lg group-hover:bg-white group-hover:text-[#769fcd] transition-all duration-300">
                            Get Started
                            <Icon
                                name="ChevronRight"
                                className="ml-1 h-4 w-4"
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