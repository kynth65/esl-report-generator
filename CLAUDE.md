# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the ESL Report Generator codebase.

## Project Overview

ESL Report Generator is a multi-level summarization system for ESL (English as a Second Language) teaching reports. It processes PDF documents and generates Daily, Monthly, and Comparison reports using OpenAI integration.

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

ESL Report Generator built on Laravel + React using Inertia.js for seamless SPA-like navigation.

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
- Authentication controllers in `app/Http/Controllers/Auth/`
- Settings controllers in `app/Http/Controllers/Settings/`

### Key Architectural Patterns

**Inertia.js Integration**: Server-side routes render React components directly. Pages are in `resources/js/pages/` and automatically resolved by Laravel Vite plugin.

**Component Organization**:
- `resources/js/components/ui/` - Reusable UI components (Radix-based)
- `resources/js/components/common/` - Shared report components (FileUploadBox, PreviewSection, etc.)
- `resources/js/components/daily/` - Daily report specific components
- `resources/js/components/monthly/` - Monthly report specific components
- `resources/js/components/comparison/` - Comparison report specific components
- `resources/js/layouts/` - Page layout components with nested structure
- `resources/js/hooks/` - Custom React hooks

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
- **Sound Notifications**: `resources/js/hooks/useNotificationSound.ts` - Audio feedback for user actions
- **Theme Support**: Dark/light mode toggle with proper PDF styling

### Common Issues & Solutions
- **Date Problems**: Always check PDF date parsing in `PDFGenerationService.php` - dates without years default to 2023
- **PDF Styling**: Homework section text color should be black (not white) for visibility
- **Grammar Display**: Use "Wrong: X | Right: Y" format for proper grammar error corrections
- **File Processing**: Large PDFs may timeout - OpenAI timeout is set to 60 seconds

### Testing & Quality Assurance
- **PHP Tests**: Use `php artisan test` or `composer test` 
- **Code Style**: Run `npm run lint` for TypeScript/React, Laravel Pint handles PHP formatting
- **Type Checking**: Use `npm run types` to verify TypeScript types
- **PDF Validation**: Always test PDF generation with various date formats to ensure current year usage