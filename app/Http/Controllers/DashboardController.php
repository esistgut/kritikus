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
        $charactersCount = Character::count();
        $recentSounds = Sound::latest()->take(5)->get();
        $recentCharacters = Character::latest()->take(5)->get();

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
