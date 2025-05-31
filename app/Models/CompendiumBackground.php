<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumBackground extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'proficiency',
        'trait',
        'text'
    ];

    protected $casts = [
        'proficiency' => 'array',
        'trait' => 'array',
        'text' => 'array'
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }
}
