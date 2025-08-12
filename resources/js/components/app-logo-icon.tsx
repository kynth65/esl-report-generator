import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="eslGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#769fcd" />
                    <stop offset="50%" stopColor="#b9d7ea" />
                    <stop offset="100%" stopColor="#d6e6f2" />
                </linearGradient>
            </defs>
            
            {/* Book base */}
            <rect x="4" y="8" width="20" height="16" rx="2" fill="url(#eslGradient)" />
            <rect x="4" y="8" width="20" height="3" rx="2" fill="#769fcd" />
            
            {/* Pages */}
            <line x1="8" y1="14" x2="20" y2="14" stroke="white" strokeWidth="1.5" opacity="0.8" />
            <line x1="8" y1="17" x2="18" y2="17" stroke="white" strokeWidth="1.5" opacity="0.8" />
            <line x1="8" y1="20" x2="16" y2="20" stroke="white" strokeWidth="1.5" opacity="0.8" />
            
            {/* Globe/World icon overlay */}
            <circle cx="24" cy="12" r="6" fill="#769fcd" stroke="white" strokeWidth="1.5" />
            <path d="M20 12 C20 8, 28 8, 28 12 C28 16, 20 16, 20 12 Z" stroke="white" strokeWidth="1" fill="none" />
            <path d="M18 12 L30 12" stroke="white" strokeWidth="1" />
            <path d="M22 8 C22 10, 26 10, 26 8" stroke="white" strokeWidth="0.8" fill="none" />
            <path d="M22 16 C22 14, 26 14, 26 16" stroke="white" strokeWidth="0.8" fill="none" />
            
            {/* Sparkle/star for learning */}
            <path d="M6 4 L7 6 L9 5 L7 7 L6 9 L5 7 L3 5 L5 6 Z" fill="#b9d7ea" />
        </svg>
    );
}
