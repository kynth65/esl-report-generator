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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
