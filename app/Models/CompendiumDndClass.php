<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumDndClass extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'hd',
        'proficiency',
        'spellAbility',
        'numSkills',
        'armor',
        'weapons',
        'tools',
        'wealth',
        'autolevel',
        'multiclassing'
    ];

    protected $casts = [
        'proficiency' => 'array',
        'armor' => 'array',
        'weapons' => 'array',
        'tools' => 'array',
        'wealth' => 'array',
        'autolevel' => 'array',
        'multiclassing' => 'array'
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }
}
