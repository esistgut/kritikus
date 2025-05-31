<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumFeat extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'prerequisite',
        'text',
        'modifiers'
    ];

    protected $casts = [
        'text' => 'array',
        'modifiers' => 'array'
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }
}
