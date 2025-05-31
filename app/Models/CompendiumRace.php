<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumRace extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'size',
        'speed',
        'ability',
        'proficiency',
        'spellAbility',
        'traits',
        'modifiers'
    ];

    protected $casts = [
        'speed' => 'array',
        'ability' => 'array',
        'proficiency' => 'array',
        'traits' => 'array',
        'modifiers' => 'array'
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }
}
