# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the ESL Report Generator codebase.

## Project Overview

SUMMIFLOW (formerly ESL Report Generator) is a comprehensive ESL (English as a Second Language) management system that combines AI-powered report generation with complete student and class schedule management. The platform features the SUMMAFLOW brand identity and processes PDF documents to generate Daily, Monthly, and Comparison reports using OpenAI integration, while providing full student management capabilities including pricing, payment tracking, and class scheduling.

## Development Commands

### Frontend (Node.js/React)
- `npm run dev` - Start development server with Vite
- `npm run build` - Build production assets
- `npm run build:ssr` - Build with server-side rendering support
- `npm run lint` - Run ESLint with auto-fix
- `npm run types` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Backend (Laravel/PHP)
- `php artisan serve` - Start Laravel development server
- `php artisan test` - Run PHP tests with Pest
- `php artisan migrate` - Run database migrations
- `composer dev` - Start full development environment (Laravel server + queue + Vite)
- `composer dev:ssr` - Start development with SSR support
- `composer test` - Run PHP tests (clears config first)

### Database
- Uses SQLite by default (`database/database.sqlite`)
- Run `php artisan migrate` to set up database tables

## Architecture Overview

SUMMAFLOW is built on Laravel + React using Inertia.js for seamless SPA-like navigation with modern UI/UX enhancements.

### Tech Stack
- **Backend**: Laravel 12.x (PHP 8.2+)
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + Radix UI components
- **Database**: SQLite (configurable)
- **Testing**: Pest (PHP), no frontend tests configured
- **Code Quality**: ESLint, Prettier, Laravel Pint
- **AI Integration**: OpenAI API for report generation
- **PDF Processing**: spatie/pdf-to-text + barryvdh/laravel-dompdf

### Core Services & Features

**Report Generation System**:
- `app/Services/ReportGenerationService.php` - Main report logic
- `app/Services/OpenAIService.php` - OpenAI API integration
- `app/Services/PDFParsingService.php` - PDF text extraction
- `app/Services/PDFGenerationService.php` - PDF output generation

**Report Types**:
- Daily Summarization (`resources/js/pages/DailySummarizationPage.tsx`)
- Monthly Summarization (`resources/js/pages/MonthlySummarizationPage.tsx`)
- Monthly Comparison (`resources/js/pages/MonthlyComparisonPage.tsx`)

**Controllers**:
- `app/Http/Controllers/Reports/DailyReportController.php` - Report generation endpoints
- `app/Http/Controllers/StudentController.php` - Student management with pricing and payment tracking
- `app/Http/Controllers/ClassScheduleController.php` - Class scheduling with duration and payment calculations
- Authentication controllers in `app/Http/Controllers/Auth/`
- Settings controllers in `app/Http/Controllers/Settings/`

**Student & Schedule Management System**:
- Student management (`resources/js/pages/Students/` directory)
- Class schedule management (`resources/js/pages/Schedules/` directory)
- Calendar integration (`resources/js/pages/calendar/index.tsx`)
- Dashboard with payment tracking (`resources/js/pages/dashboard.tsx`)

### Key Architectural Patterns

**Inertia.js Integration**: Server-side routes render React components directly. Pages are in `resources/js/pages/` and automatically resolved by Laravel Vite plugin.

**Component Organization**:
- `resources/js/components/ui/` - Reusable UI components (Radix-based)
- `resources/js/components/common/` - Shared components (FileUploadBox, PreviewSection, ActionCard, AppLogo)
- `resources/js/components/daily/` - Daily report specific components
- `resources/js/components/monthly/` - Monthly report specific components
- `resources/js/components/comparison/` - Comparison report specific components
- `resources/js/layouts/` - Page layout components with nested structure
- `resources/js/hooks/` - Custom React hooks (notifications, scroll animations)

**Route Groups**: `routes/web.php`, `routes/auth.php`, `routes/settings.php`

**Styling Architecture**: Uses Tailwind CSS 4 with custom component variants via `class-variance-authority`. Theme switching (light/dark) implemented with React hooks.

## Configuration

### Environment Setup
- Copy `.env.example` to `.env`
- Set `OPENAI_API_KEY` for AI functionality
- Configure `OPENAI_BASE_URL` and `OPENAI_MODEL` in `config/openai.php`

### PDF Processing
- Requires system dependencies for PDF text extraction
- Temporary files stored in `storage/app/private/temp/`
- PDF templates in `resources/views/pdf/`

## Important Development Notes

- Frontend and backend run on separate ports during development
- Inertia.js handles client-side navigation and form submissions
- TypeScript strict mode enabled
- Uses modern React patterns (React 19, automatic JSX transform)
- Authentication scaffolding included with email verification
- Settings pages for profile and password management included
- All report generation happens server-side with client-side preview components
- PDF uploads are processed and stored temporarily during report generation

## Key Implementation Details

### PDF Generation & Date Handling
- **PDF Templates**: Located in `resources/views/pdf/daily-report.blade.php`
- **Date Formatting**: All PDF dates now use current year (2025) to prevent defaulting to 2023
- **Filename Generation**: PDF filenames automatically use current year format (e.g., `ESL_Daily_Report_Student_2025_08_12.pdf`)
- **Date Processing**: Both display dates and filenames parse incomplete dates and default to current year

### Report Structure & Data Flow
- **Daily Reports**: 
  - Upload PDF → Parse content → Generate AI summary → Create downloadable PDF report
  - Contains: Progress Overview, Lesson Highlights, Vocabulary/Grammar/Pronunciation sections, Homework exercises
- **Homework Structure**: Uses new format with Multiple Choice Questions (MCQ) and Sentence Construction exercises
- **Grammar Errors**: Format supports "Wrong: X | Right: Y" pattern for corrections display

### AI Integration Details
- **OpenAI Service**: `app/Services/OpenAIService.php` - Timeout set to 60 seconds
- **Report Generation**: `app/Services/ReportGenerationService.php` - Handles AI prompt generation and response processing
- **Content Processing**: AI analyzes uploaded PDF content to generate personalized lesson summaries and homework

### PDF Processing Pipeline
1. **Upload**: `PDFParsingService.php` validates and extracts text from uploaded PDFs
2. **AI Analysis**: `ReportGenerationService.php` sends content to OpenAI for analysis
3. **PDF Generation**: `PDFGenerationService.php` creates formatted report with proper styling
4. **Download**: Response includes proper headers for file download with current year in filename

### UI/UX Components
- **File Upload**: `resources/js/components/common/FileUploadBox.tsx` - Drag & drop PDF upload
- **Preview System**: `resources/js/components/common/PreviewSection.tsx` - Shows report preview before download
- **Action Cards**: `resources/js/components/common/ActionCard.tsx` - Enhanced interactive cards with animations
- **App Logo**: `resources/js/components/app-logo.tsx` - SUMMAFLOW branded logo component
- **Sound Notifications**: `resources/js/hooks/useNotificationSound.ts` - Audio feedback for user actions
- **Scroll Animations**: `resources/js/hooks/useScrollAnimation.ts` - Smooth scroll-based animations for enhanced UX
- **Theme Support**: Dark/light mode toggle with proper PDF styling
- **Enhanced Welcome Page**: Modern landing page with animations and improved user engagement

### Common Issues & Solutions
- **Date Problems**: Always check PDF date parsing in `PDFGenerationService.php` - dates without years default to 2023
- **PDF Styling**: Homework section text color should be black (not white) for visibility
- **Grammar Display**: Use "Wrong: X | Right: Y" format for proper grammar error corrections
- **File Processing**: Large PDFs may timeout - OpenAI timeout is set to 60 seconds

## Student & Schedule Management Features

### Database Schema
- **Students Table**: Contains student information, pricing per hour, payment due amounts
- **Class Schedules Table**: Tracks scheduled classes with duration, start/end times, and payment calculations
- **Migrations**: 
  - `2025_08_14_075014_add_pricing_fields_to_students_table.php` - Adds pricing and payment fields
  - `2025_08_14_082106_update_class_schedules_column_names.php` - Updates schedule column structure

### Student Management
- **Models**: `app/Models/Student.php` - Eloquent model with pricing relationships
- **Pages**: 
  - Create: `resources/js/pages/Students/CreateStudentPage.tsx`
  - Edit: `resources/js/pages/Students/EditStudentPage.tsx`
  - Detail: `resources/js/pages/Students/StudentDetailPage.tsx`
- **Features**: Student profiles, pricing per hour, payment tracking, contact information

### Class Schedule Management  
- **Models**: `app/Models/ClassSchedule.php` - Eloquent model with student relationships
- **Pages**:
  - Create: `resources/js/pages/Schedules/CreateSchedulePage.tsx` 
  - Edit: `resources/js/pages/Schedules/EditSchedulePage.tsx`
- **Features**: Class scheduling, duration tracking, automatic payment calculations based on hourly rates

### Calendar & Dashboard Integration
- **Calendar**: `resources/js/pages/calendar/index.tsx` - Enhanced visual schedule management with improved UI and payment status tracking
- **Dashboard**: `resources/js/pages/dashboard.tsx` - Modern overview with enhanced statistics, payment tracking, and student metrics
- **Welcome Page**: `resources/js/pages/welcome.tsx` - Comprehensive landing page with scroll animations and modern design
- **Payment Tracking**: Real-time calculation of payments due based on scheduled class durations and hourly rates

### Key Implementation Notes
- **Payment Calculations**: Automatically calculated based on class duration × student hourly rate
- **Date Handling**: Consistent timezone handling across schedule management with improved today's classes filtering
- **UI Components**: Enhanced reusable form components with modern design patterns and responsive layouts
- **Data Relationships**: Proper Eloquent relationships between students and class schedules
- **User Experience**: Improved table layouts, button interactions, and overall UI consistency across all pages
- **Modern Branding**: SUMMAFLOW branding consistently applied across the platform

### Testing & Quality Assurance
- **PHP Tests**: Use `php artisan test` or `composer test` 
- **Code Style**: Run `npm run lint` for TypeScript/React, Laravel Pint handles PHP formatting
- **Type Checking**: Use `npm run types` to verify TypeScript types
- **PDF Validation**: Always test PDF generation with various date formats to ensure current year usage
- **Database**: Run `php artisan migrate` after pulling updates to ensure schema is current