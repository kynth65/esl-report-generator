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
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-sky-400/20 to-indigo-400/20 dark:from-blue-600/10 dark:via-sky-600/10 dark:to-indigo-600/10"></div>
                <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-blue-400/30 to-transparent blur-3xl"></div>
                <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 transform rounded-full bg-gradient-to-tl from-sky-400/30 to-transparent blur-3xl"></div>
                <div className="relative z-10">
                    {/* Navigation */}
                    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-6 py-6 backdrop-blur-md lg:px-12 dark:bg-gray-900/80">
                        <div
                            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-2xl font-bold text-transparent"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            ESL Reports
                        </div>
                        <div className="flex items-center gap-6">
                            <a
                                href="#process"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Process
                            </a>
                            <a
                                href="#services"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Services
                            </a>
                            <a
                                href="#pricing"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Pricing
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
                    <main className="flex flex-1 items-center justify-center px-6 py-32 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="space-y-12">
                                <h1
                                    className="text-6xl leading-tight font-black tracking-tight lg:text-8xl"
                                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                >
                                    <span className="text-gray-900 dark:text-white">AI-Powered</span>
                                    <br />
                                    <span className="text-gray-800 dark:text-gray-100">ESL Report</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                                        Generator
                                    </span>
                                </h1>
                                <p
                                    className="mx-auto mt-8 max-w-4xl text-2xl leading-relaxed font-light text-gray-700 lg:text-3xl dark:text-gray-300"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    Transform your ESL teaching reports with intelligent automation.
                                    <br className="hidden sm:block" />
                                    Create comprehensive daily summaries, monthly comparisons,
                                    <br className="hidden sm:block" />
                                    and detailed analytics with unprecedented ease.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                                    <Link
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="group relative transform rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:ring-4 focus:ring-blue-500/50 focus:outline-none"
                                        style={{
                                            background:
                                                'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(37,99,235,1) 50%, rgba(29,78,216,1) 100%)',
                                            boxShadow: '0 0 40px rgba(59,130,246,0.4), 0 10px 25px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <span className="relative z-10">{auth.user ? 'Go to Dashboard' : 'Get Started'}</span>
                                        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100"></div>
                                    </Link>

                                    {!auth.user && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-full border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                                        >
                                            Sign In
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-3">
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Daily Reports</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Generate comprehensive daily summaries of student progress and activities
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-600">
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Monthly Analysis</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Compare monthly performance and track long-term learning trends
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600">
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">AI Powered</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Leverage advanced AI to generate insightful educational reports
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Process Section */}
                    <section id="process" className="bg-white/50 px-6 py-40 backdrop-blur-sm lg:px-12 dark:bg-gray-800/30">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-24 text-center">
                                <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    <span className="text-gray-900 dark:text-white">How It</span>{' '}
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Works</span>
                                </h2>
                                <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Our streamlined process makes report generation effortless and efficient
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
                                <div className="group text-center">
                                    <div className="relative mb-8">
                                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                        </div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 transform rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-sm font-semibold text-white">
                                            01
                                        </div>
                                    </div>
                                    <h3
                                        className="mb-4 text-2xl font-bold text-gray-900 dark:text-white"
                                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                    >
                                        Upload Documents
                                    </h3>
                                    <p
                                        className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Simply drag and drop your PDF reports or upload them through our intuitive interface. Our system supports
                                        multiple file formats.
                                    </p>
                                </div>

                                <div className="group text-center">
                                    <div className="relative mb-8">
                                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-xl shadow-indigo-500/25 transition-all duration-300 group-hover:scale-110">
                                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 transform rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1 text-sm font-semibold text-white">
                                            02
                                        </div>
                                    </div>
                                    <h3
                                        className="mb-4 text-2xl font-bold text-gray-900 dark:text-white"
                                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                    >
                                        AI Processing
                                    </h3>
                                    <p
                                        className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Our advanced AI analyzes your documents, extracting key insights and patterns to create meaningful summaries
                                        and comparisons.
                                    </p>
                                </div>

                                <div className="group text-center">
                                    <div className="relative mb-8">
                                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl shadow-green-500/25 transition-all duration-300 group-hover:scale-110">
                                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 transform rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1 text-sm font-semibold text-white">
                                            03
                                        </div>
                                    </div>
                                    <h3
                                        className="mb-4 text-2xl font-bold text-gray-900 dark:text-white"
                                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                    >
                                        Download Reports
                                    </h3>
                                    <p
                                        className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Receive professionally formatted reports in PDF format, ready to share with colleagues, administrators, or
                                        parents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="services" className="px-6 py-40 lg:px-12">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-24 text-center">
                                <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    <span className="text-gray-900 dark:text-white">Our</span>{' '}
                                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Services</span>
                                </h2>
                                <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Comprehensive reporting solutions tailored for ESL educators
                                </p>
                            </div>

                            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                                <div>
                                    <div className="space-y-12">
                                        <div className="flex items-start gap-8">
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3
                                                    className="mb-3 text-2xl font-bold text-gray-900 dark:text-white"
                                                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                                >
                                                    Daily Summarization
                                                </h3>
                                                <p
                                                    className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
                                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                                >
                                                    Generate comprehensive daily summaries that capture student progress, learning objectives
                                                    achieved, and areas for improvement.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-8">
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3
                                                    className="mb-3 text-2xl font-bold text-gray-900 dark:text-white"
                                                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                                >
                                                    Monthly Analysis
                                                </h3>
                                                <p
                                                    className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
                                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                                >
                                                    Track long-term progress with detailed monthly reports that highlight trends, achievements, and
                                                    development patterns.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-8">
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3
                                                    className="mb-3 text-2xl font-bold text-gray-900 dark:text-white"
                                                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                                >
                                                    Comparison Reports
                                                </h3>
                                                <p
                                                    className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
                                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                                >
                                                    Compare performance across different time periods to identify growth patterns and areas needing
                                                    attention.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex h-96 w-full items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                                        <div className="text-center">
                                            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl">
                                                <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                                    />
                                                </svg>
                                            </div>
                                            <h4
                                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                            >
                                                Powered by AI
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="bg-white/50 px-6 py-40 backdrop-blur-sm lg:px-12 dark:bg-gray-800/30">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-24 text-center">
                                <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                        Advanced Features
                                    </span>
                                </h2>
                                <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Everything you need to create professional ESL reports
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        icon: (
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                                />
                                            </svg>
                                        ),
                                        title: 'Smart Analysis',
                                        description:
                                            'AI-powered content analysis that understands educational context and student progress patterns.',
                                    },
                                    {
                                        icon: (
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                />
                                            </svg>
                                        ),
                                        title: 'User-Friendly',
                                        description:
                                            'Intuitive interface designed for educators, with minimal learning curve and maximum efficiency.',
                                    },
                                    {
                                        icon: (
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        ),
                                        title: 'Lightning Fast',
                                        description:
                                            'Generate comprehensive reports in minutes, not hours. Save time for what matters most - teaching.',
                                    },
                                    {
                                        icon: (
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                        ),
                                        title: 'Secure & Private',
                                        description:
                                            'Your data is encrypted and protected. We respect your privacy and follow strict data protection standards.',
                                    },
                                    {
                                        icon: (
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2V3zM21 21v-2a2 2 0 00-2-2H9v4h10a2 2 0 002-2z"
                                                />
                                            </svg>
                                        ),
                                        title: 'Multiple Formats',
                                        description:
                                            'Export your reports in various formats including PDF, Word, and more for maximum compatibility.',
                                    },
                                    {
                                        icon: (
                                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        ),
                                        title: '24/7 Support',
                                        description: 'Get help when you need it with our dedicated support team ready to assist with any questions.',
                                    },
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-gray-200/50 bg-white/80 p-10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/80"
                                    >
                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                                            {feature.icon}
                                        </div>
                                        <h3
                                            className="mb-4 text-xl font-bold text-gray-900 dark:text-white"
                                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                        >
                                            {feature.title}
                                        </h3>
                                        <p className="leading-relaxed text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section id="pricing" className="px-6 py-40 lg:px-12">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-24 text-center">
                                <h2 className="mb-6 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    <span className="text-gray-900 dark:text-white">Simple</span>{' '}
                                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Pricing</span>
                                </h2>
                                <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Choose the plan that best fits your educational needs
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                                <div className="rounded-3xl border border-gray-200/50 bg-white/80 p-10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/80">
                                    <div className="text-center">
                                        <h3
                                            className="mb-2 text-2xl font-bold text-gray-900 dark:text-white"
                                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                        >
                                            Starter
                                        </h3>
                                        <div className="mb-6">
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white">$9</span>
                                            <span className="text-gray-600 dark:text-gray-300">/month</span>
                                        </div>
                                        <ul className="mb-8 space-y-4 text-left">
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">5 reports per month</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">Basic AI analysis</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">PDF export</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">Email support</span>
                                            </li>
                                        </ul>
                                        <button className="w-full rounded-xl border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800">
                                            Get Started
                                        </button>
                                    </div>
                                </div>

                                <div className="relative scale-105 transform rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 p-10 text-white shadow-2xl">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 text-sm font-bold text-black">
                                        Most Popular
                                    </div>
                                    <div className="text-center">
                                        <h3 className="mb-2 text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                            Professional
                                        </h3>
                                        <div className="mb-6">
                                            <span className="text-5xl font-bold">$29</span>
                                            <span className="text-indigo-200">/month</span>
                                        </div>
                                        <ul className="mb-8 space-y-4 text-left">
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>50 reports per month</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Advanced AI analysis</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Multiple export formats</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Priority support</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Custom templates</span>
                                            </li>
                                        </ul>
                                        <button className="w-full rounded-xl bg-white px-8 py-4 font-semibold text-indigo-600 shadow-lg transition-all duration-300 hover:bg-gray-50">
                                            Start Free Trial
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-gray-200/50 bg-white/80 p-10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/80">
                                    <div className="text-center">
                                        <h3
                                            className="mb-2 text-2xl font-bold text-gray-900 dark:text-white"
                                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                        >
                                            Enterprise
                                        </h3>
                                        <div className="mb-6">
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white">$99</span>
                                            <span className="text-gray-600 dark:text-gray-300">/month</span>
                                        </div>
                                        <ul className="mb-8 space-y-4 text-left">
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">Unlimited reports</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">Premium AI features</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">Team collaboration</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">24/7 phone support</span>
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-300">API access</span>
                                            </li>
                                        </ul>
                                        <button className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-lg">
                                            Contact Sales
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 px-6 py-40 text-white lg:px-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-8 text-4xl font-bold lg:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                Ready to Transform Your ESL Reporting?
                            </h2>
                            <p className="mb-12 text-xl opacity-90 lg:text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Join thousands of educators who are already saving time and creating better reports with our AI-powered platform.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="transform rounded-full bg-white px-12 py-5 text-lg font-bold text-indigo-600 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Free Trial'}
                                </Link>
                                <Link
                                    href="#process"
                                    className="rounded-full border-2 border-white px-12 py-5 text-lg font-bold text-white transition-all duration-300 hover:bg-white hover:text-indigo-600"
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
