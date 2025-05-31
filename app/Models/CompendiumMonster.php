<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumMonster extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'size',
        'type',
        'subtype',
        'alignment',
        'ac',
        'hp',
        'hit_die',
        'speed',
        'str',
        'dex',
        'con',
        'int',
        'wis',
        'cha',
        'save',
        'skill',
        'passive',
        'languages',
        'cr',
        'resist',
        'immune',
        'vulnerable',
        'conditionImmune',
        'senses',
        'traits',
        'actions',
        'legendary',
        'reactions',
        'slots',
        'spells'
    ];

    protected $casts = [
        'speed' => 'array',
        'save' => 'array',
        'skill' => 'array',
        'resist' => 'array',
        'immune' => 'array',
        'vulnerable' => 'array',
        'conditionImmune' => 'array',
        'senses' => 'array',
        'traits' => 'array',
        'actions' => 'array',
        'legendary' => 'array',
        'reactions' => 'array',
        'slots' => 'array',
        'spells' => 'array',
        'languages' => 'array'
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }
}
