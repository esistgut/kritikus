<?php

namespace Database\Seeders;

use App\Models\Sound;
use App\Models\User;
use Illuminate\Database\Seeder;

class SoundSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        foreach ($users as $user) {
            // Create some example sounds for each user
            $user->sounds()->create([
                'name' => 'Epic Battle Music',
                'filename' => 'epic_battle_sample.mp3',
                'original_filename' => 'epic_battle_sample.mp3',
                'volume' => 0.7,
                'loop' => true,
            ]);

            $user->sounds()->create([
                'name' => 'Sword Clash',
                'filename' => 'sword_clash_sample.wav',
                'original_filename' => 'sword_clash_sample.wav',
                'volume' => 0.5,
                'loop' => false,
            ]);

            $user->sounds()->create([
                'name' => 'Mystical Ambience',
                'filename' => 'mystical_ambience_sample.ogg',
                'original_filename' => 'mystical_ambience_sample.ogg',
                'volume' => 0.3,
                'loop' => true,
            ]);
        }
    }
}
