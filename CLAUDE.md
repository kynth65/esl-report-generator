# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

This is a Laravel React starter kit using Inertia.js for seamless SPA-like navigation between server-rendered pages.

### Tech Stack
- **Backend**: Laravel 12.x (PHP 8.2+)
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + Radix UI components
- **Database**: SQLite (configurable)
- **Testing**: Pest (PHP), no frontend tests configured
- **Code Quality**: ESLint, Prettier, Laravel Pint

### Key Architectural Patterns

**Inertia.js Integration**: Server-side routes render React components directly. Pages are in `resources/js/pages/` and automatically resolved by Laravel Vite plugin.

**Component Organization**:
- `resources/js/components/ui/` - Reusable UI components (Radix-based)
- `resources/js/components/` - Application-specific components
- `resources/js/layouts/` - Page layout components with nested structure
- `resources/js/hooks/` - Custom React hooks

**Laravel Structure**:
- Authentication controllers in `app/Http/Controllers/Auth/`
- Settings controllers in `app/Http/Controllers/Settings/`
- Route groups: `routes/web.php`, `routes/auth.php`, `routes/settings.php`

**Styling Architecture**: Uses Tailwind CSS 4 with custom component variants via `class-variance-authority`. Theme switching (light/dark) implemented with React hooks.

## Important Development Notes

- Frontend and backend run on separate ports during development
- Inertia.js handles client-side navigation and form submissions
- TypeScript strict mode enabled
- Uses modern React patterns (React 19, automatic JSX transform)
- Authentication scaffolding included with email verification
- Settings pages for profile and password management included