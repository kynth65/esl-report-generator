import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface AnimatedElementProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'left' | 'right';
    delay?: number;
}

function AnimatedElement({ children, className = '', direction = 'up', delay = 0 }: AnimatedElementProps) {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    const directionClass = direction === 'left' ? 'animate-on-scroll-left' : direction === 'right' ? 'animate-on-scroll-right' : 'animate-on-scroll';

    const delayClass = delay > 0 ? `animate-delay-${delay}` : '';

    return (
        <div ref={elementRef} className={`${directionClass} ${delayClass} ${isVisible ? 'animate-visible' : ''} ${className}`}>
            {children}
        </div>
    );
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <style>{`
                    
                    html {
                      scroll-behavior: smooth;
                    }

                    @keyframes fadeInUp {
                      from {
                        opacity: 0;
                        transform: translateY(30px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }

                    @keyframes fadeInLeft {
                      from {
                        opacity: 0;
                        transform: translateX(-30px);
                      }
                      to {
                        opacity: 1;
                        transform: translateX(0);
                      }
                    }

                    @keyframes fadeInRight {
                      from {
                        opacity: 0;
                        transform: translateX(30px);
                      }
                      to {
                        opacity: 1;
                        transform: translateX(0);
                      }
                    }

                    .animate-on-scroll {
                      opacity: 0;
                      transform: translateY(30px);
                      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    }

                    .animate-on-scroll-left {
                      opacity: 0;
                      transform: translateX(-30px);
                      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    }

                    .animate-on-scroll-right {
                      opacity: 0;
                      transform: translateX(30px);
                      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    }

                    .animate-visible {
                      opacity: 1;
                      transform: translate(0, 0);
                    }

                    .animate-delay-200 {
                      transition-delay: 200ms;
                    }

                    .animate-delay-400 {
                      transition-delay: 400ms;
                    }

                    .animate-delay-600 {
                      transition-delay: 600ms;
                    }

                    .animate-delay-800 {
                      transition-delay: 800ms;
                    }

                    .animate-delay-1000 {
                      transition-delay: 1000ms;
                    }

                    .animate-delay-1200 {
                      transition-delay: 1200ms;
                    }

                
                `}</style>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Libre+Baskerville:wght@400;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Full dark background with subtle gradients */}
            <div className="relative min-h-screen bg-background text-foreground">
                {/* Symmetrical background gradient rectangles */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-50"></div>
                <div className="absolute top-32 right-32 h-96 w-48 rounded-3xl bg-primary/8 blur-3xl"></div>
                <div className="absolute top-96 left-32 h-80 w-40 rounded-3xl bg-blue-500/12 blur-3xl"></div>
                <div className="absolute top-[600px] right-24 h-72 w-36 rounded-3xl bg-primary/6 blur-3xl"></div>
                <div className="absolute top-[900px] left-24 h-64 w-32 rounded-3xl bg-blue-500/10 blur-3xl"></div>
                <div className="absolute top-[1200px] right-32 h-88 w-44 rounded-3xl bg-primary/7 blur-3xl"></div>
                <div className="absolute top-[1500px] left-24 h-96 w-48 rounded-3xl bg-blue-500/12 blur-3xl"></div>
                <div className="absolute top-[1800px] right-1/4 h-80 w-40 rounded-3xl bg-primary/6 blur-3xl"></div>
                <div className="absolute bottom-32 left-32 h-96 w-48 rounded-3xl bg-blue-500/9 blur-3xl"></div>

                <div className="relative z-10">
                    {/* Navigation */}
                    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                            <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                ESL Report Generator
                            </div>
                            <div className="hidden items-center gap-8 md:flex">
                                <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
                                    Features
                                </a>
                                <a href="#process" className="text-muted-foreground transition-colors hover:text-foreground">
                                    How it works
                                </a>
                                <a href="#testimonials" className="text-muted-foreground transition-colors hover:text-foreground">
                                    Testimonials
                                </a>
                                <a href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                                    Pricing
                                </a>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-muted-foreground transition-colors hover:text-foreground">
                                            Sign in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <section className="relative px-6 py-32 text-center lg:px-8 lg:py-40">
                        <div className="mx-auto max-w-5xl">
                            {/* Section Label */}
                            <AnimatedElement className="mb-8">
                                <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                                    AI-POWERED ESL MANAGEMENT
                                </span>
                            </AnimatedElement>

                            {/* Hero Title */}
                            <AnimatedElement delay={200}>
                                <h1
                                    className="mb-8 text-5xl leading-tight font-bold tracking-tight lg:text-7xl"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Transform <span className="text-primary">ESL Teaching</span>,<br />
                                    Manage <span className="text-accent">Students & Reports</span>
                                </h1>
                            </AnimatedElement>

                            {/* Hero Subtitle */}
                            <AnimatedElement delay={400}>
                                <p
                                    className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground lg:text-2xl"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Comprehensive ESL management system featuring AI-powered report generation, student management, class scheduling,
                                    and payment tracking - all in one platform.
                                </p>
                            </AnimatedElement>

                            {/* CTA Buttons */}
                            <AnimatedElement delay={600} className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="group rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-lg"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Get Started for Free'}
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-border bg-card px-8 py-4 text-lg font-medium text-foreground transition-all hover:scale-105 hover:bg-muted"
                                >
                                    {auth.user ? 'View Features' : 'Sign In'}
                                </Link>
                            </AnimatedElement>

                            {/* Trust Indicators */}
                            <AnimatedElement delay={800} className="text-center">
                                <p className="mb-8 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                    Complete ESL Management Solution
                                </p>
                                <div className="flex items-center justify-center gap-8 opacity-60">
                                    <div className="text-lg font-semibold">Report Generation</div>
                                    <div className="text-lg font-semibold">Student Management</div>
                                    <div className="text-lg font-semibold">Class Scheduling</div>
                                </div>
                            </AnimatedElement>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="features" className="px-6 py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            {/* Section Header */}
                            <div className="mb-16 text-center">
                                <AnimatedElement className="mb-4">
                                    <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                                        FEATURES
                                    </span>
                                </AnimatedElement>
                                <AnimatedElement delay={200}>
                                    <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Why Choose our <span className="text-primary">Platform?</span>
                                    </h2>
                                </AnimatedElement>
                                <AnimatedElement delay={400}>
                                    <p className="mx-auto max-w-3xl text-xl text-muted-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Complete ESL management solution with AI-powered reports, student tracking, and class scheduling
                                    </p>
                                </AnimatedElement>
                            </div>

                            {/* Feature Grid */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {/* Daily Reports */}
                                <AnimatedElement delay={600}>
                                    <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                                            <svg
                                                className="h-6 w-6 text-primary-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-4 text-xl font-semibold">AI-Powered Report Generation</h3>
                                        <p className="leading-relaxed text-muted-foreground">
                                            Generate Daily, Monthly, and Comparison reports using OpenAI integration. Upload PDFs and get
                                            comprehensive analysis with homework exercises and progress tracking.
                                        </p>
                                    </div>
                                </AnimatedElement>

                                {/* Monthly Analysis */}
                                <AnimatedElement delay={800}>
                                    <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2">
                                            <svg
                                                className="h-6 w-6 text-primary-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-4 text-xl font-semibold">Student Management System</h3>
                                        <p className="leading-relaxed text-muted-foreground">
                                            Complete student database with pricing per hour, payment tracking, contact information, and detailed
                                            profiles for effective management.
                                        </p>
                                    </div>
                                </AnimatedElement>

                                {/* Real-Time Processing */}
                                <AnimatedElement delay={1000}>
                                    <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4">
                                            <svg
                                                className="h-6 w-6 text-primary-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-4 text-xl font-semibold">Class Schedule Management</h3>
                                        <p className="leading-relaxed text-muted-foreground">
                                            Schedule classes with automatic payment calculations, duration tracking, and calendar integration for
                                            seamless lesson planning.
                                        </p>
                                    </div>
                                </AnimatedElement>

                                {/* Smart Analysis */}
                                <AnimatedElement delay={1200}>
                                    <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                                            <svg
                                                className="h-6 w-6 text-accent-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.611L5 14.5"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-4 text-xl font-semibold">Dashboard & Analytics</h3>
                                        <p className="leading-relaxed text-muted-foreground">
                                            Visual dashboard with payment tracking, student metrics, and comprehensive overview of your ESL teaching
                                            business.
                                        </p>
                                    </div>
                                </AnimatedElement>

                                {/* Secure Storage */}
                                <AnimatedElement delay={800}>
                                    <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5">
                                            <svg
                                                className="h-6 w-6 text-primary-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-4 text-xl font-semibold">PDF Processing & Generation</h3>
                                        <p className="leading-relaxed text-muted-foreground">
                                            Upload and analyze PDF documents, extract lesson content, and generate professional PDF reports with
                                            proper formatting and styling.
                                        </p>
                                    </div>
                                </AnimatedElement>

                                {/* Easy Integration */}
                                <AnimatedElement delay={1000}>
                                    <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3">
                                            <svg
                                                className="h-6 w-6 text-primary-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-4 text-xl font-semibold">Built with Modern Tech</h3>
                                        <p className="leading-relaxed text-muted-foreground">
                                            Laravel + React architecture with TypeScript, Tailwind CSS, and SQLite database for reliable and scalable
                                            performance.
                                        </p>
                                    </div>
                                </AnimatedElement>
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section id="process" className="px-6 py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            {/* Section Header */}
                            <div className="mb-16 text-center">
                                <AnimatedElement className="mb-4">
                                    <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                                        HOW TO USE?
                                    </span>
                                </AnimatedElement>
                                <AnimatedElement delay={200}>
                                    <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        How it <span className="text-primary">works?</span>
                                    </h2>
                                </AnimatedElement>
                                <AnimatedElement delay={400}>
                                    <p className="mx-auto max-w-3xl text-xl text-muted-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Simple workflow to streamline your ESL teaching and management
                                    </p>
                                </AnimatedElement>
                            </div>

                            {/* Steps Grid */}
                            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
                                {/* Step 1 */}
                                <AnimatedElement direction="left" delay={600}>
                                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                                        <div className="mb-8">
                                            <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary">
                                                STEP 1
                                            </span>
                                        </div>
                                        <h3 className="mb-6 text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Upload & Analyze
                                        </h3>
                                        <p className="mb-8 max-w-md text-lg text-muted-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Upload PDF lesson materials and let our AI analyze content to generate comprehensive reports with insights
                                            and homework.
                                        </p>
                                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                <div className="h-2 w-2 rounded-full bg-primary/50"></div>
                                                <div className="h-2 w-2 rounded-full bg-muted"></div>
                                            </div>
                                            <div className="text-left">
                                                <div className="mb-2 text-lg font-semibold">PDF Upload</div>
                                                <div className="text-sm text-muted-foreground">Drag & drop lesson materials</div>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedElement>

                                {/* Step 2 */}
                                <AnimatedElement direction="right" delay={800}>
                                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                                        <div className="mb-8">
                                            <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary">
                                                STEP 2
                                            </span>
                                        </div>
                                        <h3 className="mb-6 text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Manage & Schedule
                                        </h3>
                                        <p className="mb-8 max-w-md text-lg text-muted-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Manage student profiles, schedule classes, track payments, and maintain comprehensive records all in one
                                            place.
                                        </p>
                                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="text-sm font-medium">Student Dashboard</div>
                                                <div className="flex gap-2">
                                                    <button className="rounded bg-muted px-3 py-1 text-xs">Schedule</button>
                                                    <button className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground">Payment</button>
                                                </div>
                                            </div>
                                            <div className="text-left text-sm text-muted-foreground">
                                                Track student progress, payments, and schedule management.
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedElement>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section id="testimonials" className="px-6 py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            {/* Section Header */}
                            <div className="mb-16 text-center">
                                <div className="mb-4">
                                    <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                                        TESTIMONIALS
                                    </span>
                                </div>
                                <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    What Our <span className="text-primary">Users Say</span>
                                </h2>
                            </div>

                            {/* Testimonials Grid */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                <AnimatedElement delay={400}>
                                    <div className="rounded-2xl border border-border bg-card p-8">
                                        <p className="mb-6 text-lg leading-relaxed">
                                            "ESL Report Generator transformed my teaching workflow! The AI-powered reports save hours of work, and
                                            student management is incredibly efficient. Highly recommend!"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                                            <div>
                                                <div className="font-semibold">Sarah Chen</div>
                                                <div className="text-sm text-muted-foreground">EduTech Institute</div>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedElement>

                                <AnimatedElement delay={600}>
                                    <div className="rounded-2xl border border-border bg-card p-8">
                                        <p className="mb-6 text-lg leading-relaxed">
                                            "The class scheduling and payment tracking features are game-changers. Managing my ESL students has never
                                            been this organized and professional."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-chart-2/20"></div>
                                            <div>
                                                <div className="font-semibold">Michael Rodriguez</div>
                                                <div className="text-sm text-muted-foreground">Language Academy</div>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedElement>

                                <AnimatedElement delay={800}>
                                    <div className="rounded-2xl border border-border bg-card p-8">
                                        <p className="mb-6 text-lg leading-relaxed">
                                            "The PDF analysis and report generation is amazing! Upload lesson materials and get comprehensive reports
                                            with homework exercises. Perfect for ESL educators."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-chart-4/20"></div>
                                            <div>
                                                <div className="font-semibold">Emma Thompson</div>
                                                <div className="text-sm text-muted-foreground">Global ESL Center</div>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedElement>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section id="pricing" className="px-6 py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            {/* Section Header */}
                            <div className="mb-16 text-center">
                                <AnimatedElement className="mb-4">
                                    <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                                        PRICINGS
                                    </span>
                                </AnimatedElement>
                                <AnimatedElement delay={200}>
                                    <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Choose a Plan That Suits Your <span className="text-primary">Teaching</span>
                                    </h2>
                                </AnimatedElement>
                                <AnimatedElement delay={400}>
                                    <p className="mb-8 text-xl text-muted-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Flexible pricing for ESL educators and institutions
                                    </p>
                                </AnimatedElement>

                                {/* Billing Toggle */}
                                <AnimatedElement delay={600} className="flex items-center justify-center gap-4">
                                    <span className="text-muted-foreground">Monthly</span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" />
                                        <div className="h-6 w-11 rounded-full border border-border bg-muted"></div>
                                        <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-primary transition-transform"></div>
                                    </div>
                                    <span>Yearly</span>
                                </AnimatedElement>
                            </div>

                            {/* Pricing Grid */}
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Basic Plan */}
                                <AnimatedElement delay={800}>
                                    <div className="rounded-2xl border border-border bg-card p-8">
                                        <h3 className="mb-2 text-2xl font-bold">Individual Educator</h3>
                                        <p className="mb-6 text-muted-foreground">Perfect for individual ESL teachers starting out.</p>
                                        <div className="mb-8">
                                            <span className="text-4xl font-bold">$0</span>
                                            <span className="text-muted-foreground">/Month</span>
                                        </div>
                                        <button className="mb-8 w-full rounded-full border border-border bg-background py-3 font-medium transition-colors hover:bg-muted">
                                            Get Started for Free
                                        </button>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Up to 20 students</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Daily report generation</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Basic scheduling</span>
                                            </li>
                                        </ul>
                                    </div>
                                </AnimatedElement>

                                {/* Pro Plan */}
                                <AnimatedElement delay={1000}>
                                    <div className="relative rounded-2xl border-2 border-primary bg-card p-8">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                                            Most Popular
                                        </div>
                                        <h3 className="mb-2 text-2xl font-bold">Professional Teacher</h3>
                                        <p className="mb-6 text-muted-foreground">For established ESL educators with larger student bases.</p>
                                        <div className="mb-8">
                                            <span className="text-4xl font-bold">$19.99</span>
                                            <span className="text-muted-foreground">/Month</span>
                                        </div>
                                        <button className="mb-8 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                                            Get Started
                                        </button>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Up to 100 students</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>All report types</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Payment tracking</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Calendar integration</span>
                                            </li>
                                        </ul>
                                    </div>
                                </AnimatedElement>

                                {/* Enterprise Plan */}
                                <AnimatedElement delay={1200}>
                                    <div className="rounded-2xl border border-border bg-card p-8">
                                        <h3 className="mb-2 text-2xl font-bold">Language School</h3>
                                        <p className="mb-6 text-muted-foreground">For ESL institutions and language schools.</p>
                                        <div className="mb-8">
                                            <span className="text-4xl font-bold">$39.99</span>
                                            <span className="text-muted-foreground">/Month</span>
                                        </div>
                                        <button className="mb-8 w-full rounded-full border border-border bg-background py-3 font-medium transition-colors hover:bg-muted">
                                            Get Started
                                        </button>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Unlimited students</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Multi-teacher access</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Advanced analytics</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Priority support</span>
                                            </li>
                                        </ul>
                                    </div>
                                </AnimatedElement>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="px-6 py-24 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <AnimatedElement>
                                <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Get Started Today
                                </h2>
                            </AnimatedElement>
                            <AnimatedElement delay={200}>
                                <p className="mb-12 text-xl text-muted-foreground lg:text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Ready to streamline your ESL teaching? Join educators using our comprehensive management platform.
                                </p>
                            </AnimatedElement>
                            <AnimatedElement delay={400} className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Free Trial'}
                                </Link>
                                <Link
                                    href="#features"
                                    className="rounded-full border border-border bg-card px-8 py-4 text-lg font-medium transition-all hover:scale-105 hover:bg-muted"
                                >
                                    Learn More
                                </Link>
                            </AnimatedElement>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
