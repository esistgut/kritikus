<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumItem extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'type',
        'subtype',
        'weight',
        'value',
        'rarity',
        'requires_attunement',
        'ac',
        'strength',
        'stealth',
        'damage',
        'damage_type',
        'properties',
        'text',
        'modifiers'
    ];

    protected $casts = [
        'properties' => 'array',
        'text' => 'array',
        'modifiers' => 'array',
        'requires_attunement' => 'boolean',
        'weight' => 'decimal:2',
        'value' => 'decimal:2'
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }
}
