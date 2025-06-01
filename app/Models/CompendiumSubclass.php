<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompendiumSubclass extends Model
{
    protected $fillable = [
        'compendium_entry_id',
        'parent_class_id',
        'features',
        'autolevels',
    ];

    protected $casts = [
        'features' => 'array',
        'autolevels' => 'array',
    ];

    public function compendiumEntry(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class);
    }

    public function parentClass(): BelongsTo
    {
        return $this->belongsTo(CompendiumEntry::class, 'parent_class_id');
    }
}
