<?php

namespace App\Http\Controllers;

use App\Models\Sound;
use App\Models\Character;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $soundsCount = Sound::count();
        $charactersCount = auth()->user()->characters()->count();
        $recentSounds = Sound::latest()->take(5)->get();
        $recentCharacters = auth()->user()->characters()->latest()->take(5)->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'sounds' => $soundsCount,
                'characters' => $charactersCount,
            ],
            'recentSounds' => $recentSounds,
            'recentCharacters' => $recentCharacters,
        ]);
    }
}
