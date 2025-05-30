<?php

use App\Http\Controllers\CharacterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SoundController;
use Illuminate\Support\Facades\Route;

// Dashboard route (new default page)
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

// Soundboard routes (moved to /soundboard)
Route::get('/soundboard', [SoundController::class, 'index'])->name('sounds.index');
Route::post('/sounds', [SoundController::class, 'store'])->name('sounds.store');
Route::put('/sounds/{sound}', [SoundController::class, 'update'])->name('sounds.update');
Route::delete('/sounds/{sound}', [SoundController::class, 'destroy'])->name('sounds.destroy');

Route::resource('characters', CharacterController::class);
