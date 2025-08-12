import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#769fcd] to-[#b9d7ea] shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
                <AppLogoIcon className="size-6 fill-current text-white drop-shadow-sm" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-sidebar-foreground bg-gradient-to-r from-[#769fcd] to-[#b9d7ea] bg-clip-text text-transparent">
                    ESL Report Generator
                </span>
                <span className="text-xs text-sidebar-foreground/70 truncate">
                    AI-Powered Education Reports
                </span>
            </div>
        </>
    );
}
