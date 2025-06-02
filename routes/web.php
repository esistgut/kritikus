<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CharacterController;
use App\Http\Controllers\CompendiumController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SoundController;
use App\Http\Controllers\Api\CharacterCompendiumController;
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
Route::middleware('auto.auth')->group(function () {
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

    // Character compendium API routes for dynamic loading
    Route::prefix('api/character-compendium')->group(function () {
        Route::get('/races', [CharacterCompendiumController::class, 'races'])->name('character-compendium.races');
        Route::get('/classes', [CharacterCompendiumController::class, 'classes'])->name('character-compendium.classes');
        Route::get('/backgrounds', [CharacterCompendiumController::class, 'backgrounds'])->name('character-compendium.backgrounds');
        Route::get('/spells', [CharacterCompendiumController::class, 'spells'])->name('character-compendium.spells');
        Route::get('/feats', [CharacterCompendiumController::class, 'feats'])->name('character-compendium.feats');
        Route::get('/items', [CharacterCompendiumController::class, 'items'])->name('character-compendium.items');
        Route::post('/selected-spells', [CharacterCompendiumController::class, 'selectedSpells'])->name('character-compendium.selected-spells');
        Route::post('/selected-feats', [CharacterCompendiumController::class, 'selectedFeats'])->name('character-compendium.selected-feats');
        Route::post('/selected-items', [CharacterCompendiumController::class, 'selectedItems'])->name('character-compendium.selected-items');
    });
});
