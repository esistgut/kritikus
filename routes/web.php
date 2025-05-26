<?php

use App\Http\Controllers\SoundController;
use Illuminate\Support\Facades\Route;

Route::get('/', [SoundController::class, 'index'])->name('sounds.index');
Route::post('/sounds', [SoundController::class, 'store'])->name('sounds.store');
Route::put('/sounds/{sound}', [SoundController::class, 'update'])->name('sounds.update');
Route::delete('/sounds/{sound}', [SoundController::class, 'destroy'])->name('sounds.destroy');