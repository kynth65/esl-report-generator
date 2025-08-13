<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ESL Report Generator Routes
    Route::get('daily-summary', function () {
        return Inertia::render('DailySummarizationPage');
    })->name('daily-summary');

    Route::get('monthly-summary', function () {
        return Inertia::render('MonthlySummarizationPage');
    })->name('monthly-summary');

    Route::get('monthly-comparison', function () {
        return Inertia::render('MonthlyComparisonPage');
    })->name('monthly-comparison');
});

// API Routes for Reports - using Route::middleware for more explicit control
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('api/reports')->name('api.reports.')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])->group(function () {
        // Daily Report Routes
        Route::post('daily/generate', [App\Http\Controllers\Reports\DailyReportController::class, 'generate'])
            ->name('daily.generate');
        Route::get('daily/sample', [App\Http\Controllers\Reports\DailyReportController::class, 'sample'])
            ->name('daily.sample');
        Route::post('daily/test-pdf', [App\Http\Controllers\Reports\DailyReportController::class, 'testPdfParsing'])
            ->name('daily.test-pdf');
        Route::post('daily/download-pdf', [App\Http\Controllers\Reports\DailyReportController::class, 'downloadPdf'])
            ->name('daily.download-pdf');
        Route::post('daily/preview-pdf', [App\Http\Controllers\Reports\DailyReportController::class, 'previewPdf'])
            ->name('daily.preview-pdf');

        // Monthly Report Routes
        Route::post('monthly/generate', [App\Http\Controllers\Reports\MonthlyReportController::class, 'generate'])
            ->name('monthly.generate');
        Route::post('monthly/download-pdf', [App\Http\Controllers\Reports\MonthlyReportController::class, 'downloadPdf'])
            ->name('monthly.download-pdf');
        Route::post('monthly/preview-pdf', [App\Http\Controllers\Reports\MonthlyReportController::class, 'previewPdf'])
            ->name('monthly.preview-pdf');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
