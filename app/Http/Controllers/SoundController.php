<?php

namespace App\Http\Controllers;

use App\Models\Sound;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SoundController extends Controller
{
    public function index()
    {
        return Inertia::render('Soundboard', [
            'sounds' => Sound::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sound' => 'required|file|mimes:mp3,wav,ogg,m4a|max:10240', // 10MB max
            'name' => 'nullable|string|max:255',
        ]);

        $file = $request->file('sound');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // Store the file in the public/sounds directory
        $file->storeAs('sounds', $filename, 'public');

        $sound = Sound::create([
            'name' => $request->name ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'volume' => 0.5,
            'loop' => false,
        ]);

        return redirect()->back()->with('message', 'Sound uploaded successfully!');
    }

    public function update(Request $request, Sound $sound)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'volume' => 'required|numeric|min:0|max:1',
            'loop' => 'required|boolean',
        ]);

        $sound->update($request->only(['name', 'volume', 'loop']));

        return redirect()->back();
    }

    public function destroy(Sound $sound)
    {
        $sound->delete();

        return redirect()->back()->with('message', 'Sound deleted successfully!');
    }
}
