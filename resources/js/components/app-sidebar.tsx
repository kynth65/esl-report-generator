import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavESL } from '@/components/nav-esl';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, FileText, Calendar, GitCompare, Users, CalendarDays } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Students',
        href: '/students',
        icon: Users,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: CalendarDays,
    },
];

const eslReportItems: NavItem[] = [
    {
        title: 'Daily Summary',
        href: '/daily-summary',
        icon: FileText,
    },
    {
        title: 'Monthly Summary',
        href: '/monthly-summary',
        icon: Calendar,
    },
    {
        title: 'Monthly Comparison',
        href: '/monthly-comparison',
        icon: GitCompare,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset" 
            className="bg-gradient-to-b from-sidebar via-[#f7fbfc] to-sidebar border-r border-[#d6e6f2]/20 shadow-lg backdrop-blur-sm"
        >
            <SidebarHeader className="border-b border-[#d6e6f2]/30 pb-4 mb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild 
                            className="hover:bg-[#d6e6f2]/20 rounded-xl transition-all duration-300 hover:shadow-sm"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="space-y-6 px-2">
                <NavMain items={mainNavItems} />
                <NavESL items={eslReportItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-[#d6e6f2]/30 pt-4 mt-auto">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
