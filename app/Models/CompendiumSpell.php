<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumSpell extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'level',
        'school',
        'casting_time',
        'range',
        'components',
        'duration',
        'ritual',
        'concentration',
        'classes',
        'text',
        'at_higher_levels',
        'modifiers'
    ];

    protected $casts = [
        'components' => 'array',
        'classes' => 'array',
        'text' => 'array',
        'modifiers' => 'array',
        'ritual' => 'boolean',
        'concentration' => 'boolean'
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }
}
