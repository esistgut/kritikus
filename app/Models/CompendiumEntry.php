<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CompendiumEntry extends Model
{
    protected $fillable = [
        'name',
        'entry_type',
        'is_system',
        'user_id',
        'text',
        'source',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    /**
     * Get the user who created this entry (null for system entries)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the spell details if this is a spell entry
     */
    public function spell(): HasOne
    {
        return $this->hasOne(CompendiumSpell::class);
    }

    /**
     * Get the item details if this is an item entry
     */
    public function item(): HasOne
    {
        return $this->hasOne(CompendiumItem::class);
    }

    /**
     * Get the monster details if this is a monster entry
     */
    public function monster(): HasOne
    {
        return $this->hasOne(CompendiumMonster::class);
    }

    /**
     * Get the race details if this is a race entry
     */
    public function race(): HasOne
    {
        return $this->hasOne(CompendiumRace::class);
    }

    /**
     * Get the class details if this is a class entry
     */
    public function dndClass(): HasOne
    {
        return $this->hasOne(CompendiumDndClass::class);
    }

    /**
     * Get the background details if this is a background entry
     */
    public function background(): HasOne
    {
        return $this->hasOne(CompendiumBackground::class);
    }

    /**
     * Get the feat details if this is a feat entry
     */
    public function feat(): HasOne
    {
        return $this->hasOne(CompendiumFeat::class);
    }

    /**
     * Get the specific data based on entry type
     */
    public function getSpecificDataAttribute()
    {
        return match($this->entry_type) {
            'spell' => $this->spell,
            'item' => $this->item,
            'monster' => $this->monster,
            'race' => $this->race,
            'class' => $this->dndClass,
            'background' => $this->background,
            'feat' => $this->feat,
            default => null,
        };
    }
}
