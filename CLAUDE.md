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