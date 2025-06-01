<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'autolevels',
        'traits',
    ];

    protected $casts = [
        'proficiency' => 'array',
        'armor' => 'array',
        'weapons' => 'array',
        'tools' => 'array',
        'wealth' => 'array',
        'autolevels' => 'array',
        'traits' => 'array',
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }

    public function subclasses(): HasMany
    {
        return $this->hasMany(CompendiumSubclass::class, 'parent_class_id', 'compendium_entry_id');
    }
}
