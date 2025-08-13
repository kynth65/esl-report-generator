import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900|space-grotesk:300,400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
                {/* Clean minimal background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
                <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl dark:bg-blue-900/20"></div>
                <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-green-100/40 blur-3xl dark:bg-green-900/20"></div>
                <div className="relative z-10">
                    {/* Navigation */}
                    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white/95 px-6 py-6 backdrop-blur-sm border-b border-gray-100 lg:px-12 dark:bg-gray-900/95 dark:border-gray-800">
                        <div
                            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            SUMMAFLOW
                        </div>
                        <div className="flex items-center gap-6">
                            <a
                                href="#process"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                How It Works
                            </a>
                            <a
                                href="#services"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Services
                            </a>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-gray-900 px-5 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-gray-900 px-5 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <main className="flex flex-1 items-center justify-center px-6 py-24 lg:px-12">
                        <div className="mx-auto max-w-5xl text-center">
                            <div className="space-y-16">
                                <div className="space-y-8">
                                    <h1
                                        className="text-5xl leading-tight font-bold tracking-tight lg:text-7xl"
                                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                    >
                                        <span className="text-gray-900 dark:text-white">Intelligent</span>
                                        <br />
                                        <span className="text-blue-600 dark:text-blue-400">ESL Report</span>
                                        <br />
                                        <span className="text-gray-700 dark:text-gray-300">Summarization</span>
                                    </h1>
                                    <div className="flex justify-center">
                                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <p
                                    className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 lg:text-2xl dark:text-gray-400"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    Transform your ESL teaching documentation with AI-powered analysis.
                                    <br className="hidden sm:block" />
                                    Create professional reports in minutes, not hours.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                    <Link
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="group relative rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                    >
                                        <span className="relative z-10">{auth.user ? 'Go to Dashboard' : 'Get Started'}</span>
                                    </Link>

                                    {!auth.user && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-xl border border-gray-300 px-8 py-4 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                                        >
                                            Sign In
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
                                    <div className="group text-center p-6 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700">
                                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
                                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Daily Reports</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            Generate comprehensive daily summaries of student progress and learning activities
                                        </p>
                                    </div>

                                    <div className="group text-center p-6 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700">
                                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500">
                                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                            </svg>
                                        </div>
                                        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Monthly Analysis</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            Compare performance across periods and track long-term learning trends
                                        </p>
                                    </div>

                                    <div className="group text-center p-6 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700">
                                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500">
                                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                            </svg>
                                        </div>
                                        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">AI Powered</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            Leverage advanced AI to generate insightful and accurate educational reports
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Process Section */}
                    <section id="process" className="bg-gray-50/50 px-6 py-24 lg:px-12 dark:bg-gray-800/30">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold lg:text-5xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    <span className="text-gray-900 dark:text-white">How It</span>{' '}
                                    <span className="text-blue-600 dark:text-blue-400">Works</span>
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Three simple steps to transform your ESL teaching documentation
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                                <div className="group text-center">
                                    <div className="relative mb-8">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-sm transition-all duration-200 group-hover:shadow-md">
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                                            01
                                        </div>
                                    </div>
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                        Upload Documents
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        Simply upload your PDF teaching reports through our intuitive interface
                                    </p>
                                </div>

                                <div className="group text-center">
                                    <div className="relative mb-8">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 shadow-sm transition-all duration-200 group-hover:shadow-md">
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                            </svg>
                                        </div>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                                            02
                                        </div>
                                    </div>
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                        AI Analysis
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        Advanced AI analyzes your content and extracts meaningful insights and patterns
                                    </p>
                                </div>

                                <div className="group text-center">
                                    <div className="relative mb-8">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 shadow-sm transition-all duration-200 group-hover:shadow-md">
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                        </div>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                            03
                                        </div>
                                    </div>
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                        Download Reports
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        Receive professionally formatted reports ready to share with stakeholders
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="services" className="px-6 py-24 lg:px-12">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold lg:text-5xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    <span className="text-gray-900 dark:text-white">Our</span>{' '}
                                    <span className="text-blue-600 dark:text-blue-400">Services</span>
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Comprehensive reporting solutions designed for ESL educators
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="rounded-2xl border border-gray-100 bg-white/80 p-8 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                                Daily Summarization
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                Generate comprehensive daily summaries that capture student progress, learning objectives achieved, and areas for improvement.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white/80 p-8 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                                Monthly Analysis
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                Track long-term progress with detailed monthly reports that highlight trends, achievements, and development patterns.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white/80 p-8 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-500">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                                Comparison Reports
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                Compare performance across different time periods to identify growth patterns and areas needing attention.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="bg-gray-50/50 px-6 py-24 lg:px-12 dark:bg-gray-800/30">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold lg:text-5xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    <span className="text-gray-900 dark:text-white">Why Choose</span>{' '}
                                    <span className="text-blue-600 dark:text-blue-400">SUMMAFLOW</span>
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Built specifically for ESL educators with simplicity and effectiveness in mind
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-xl border border-gray-100 bg-white/80 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/80">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Smart AI Analysis</h3>
                                    <p className="text-gray-600 dark:text-gray-400">AI understands educational context and student progress patterns</p>
                                </div>

                                <div className="rounded-xl border border-gray-100 bg-white/80 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/80">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75-7.478V8.25m0 0a3 3 0 00-3-3V3m3 2.25V3m-3 1.5V1.5" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Lightning Fast</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Generate comprehensive reports in minutes, not hours</p>
                                </div>

                                <div className="rounded-xl border border-gray-100 bg-white/80 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/80">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Secure & Private</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Your data is encrypted and follows strict protection standards</p>
                                </div>

                                <div className="rounded-xl border border-gray-100 bg-white/80 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/80">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Education Focused</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Designed specifically for ESL educators and learning contexts</p>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* CTA Section */}
                    <section className="bg-blue-600 px-6 py-20 text-white lg:px-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-6 text-3xl font-bold lg:text-5xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                Ready to Transform Your ESL Reporting?
                            </h2>
                            <p className="mb-8 text-lg opacity-90 lg:text-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Join educators who are already saving time with SUMMAFLOW's AI-powered platform.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-sm transition-all duration-200 hover:bg-gray-50"
                                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Get Started'}
                                </Link>
                                <Link
                                    href="#process"
                                    className="rounded-xl border border-white px-8 py-4 font-medium text-white transition-all duration-200 hover:bg-white hover:text-blue-600"
                                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
