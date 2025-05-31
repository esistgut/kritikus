<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CharacterController;
use App\Http\Controllers\CompendiumController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SoundController;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

// Protected routes - require authentication
Route::middleware('auth')->group(function () {
    // Dashboard route (new default page)
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Soundboard routes (moved to /soundboard)
    Route::get('/soundboard', [SoundController::class, 'index'])->name('sounds.index');
    Route::post('/sounds', [SoundController::class, 'store'])->name('sounds.store');
    Route::put('/sounds/{sound}', [SoundController::class, 'update'])->name('sounds.update');
    Route::delete('/sounds/{sound}', [SoundController::class, 'destroy'])->name('sounds.destroy');

    Route::resource('characters', CharacterController::class);

    // Compendium routes
    Route::resource('compendium', CompendiumController::class);

    // Additional compendium API routes for character creation
    Route::get('/api/compendium/{type}', [CompendiumController::class, 'getByType'])->name('compendium.by-type');
});
