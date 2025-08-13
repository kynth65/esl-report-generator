import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#60a5fa] shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
                <AppLogoIcon className="size-6 fill-current text-white drop-shadow-sm" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-sidebar-foreground bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent">
                    SUMMAFLOW
                </span>
                <span className="text-xs text-sidebar-foreground/70 truncate">
                    ESL Report Generator
                </span>
            </div>
        </>
    );
}
