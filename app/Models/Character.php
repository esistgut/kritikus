<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Character extends Model
{
    protected $fillable = [
        'name',
        'class',
        'race',
        'background',
        'level',
        'experience',
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma',
        'armor_class',
        'initiative',
        'speed',
        'hit_point_maximum',
        'current_hit_points',
        'temporary_hit_points',
        'hit_dice',
        'hit_dice_total',
        'strength_save_proficiency',
        'dexterity_save_proficiency',
        'constitution_save_proficiency',
        'intelligence_save_proficiency',
        'wisdom_save_proficiency',
        'charisma_save_proficiency',
        'skill_proficiencies',
        'skill_expertises',
        'languages',
        'armor_proficiencies',
        'weapon_proficiencies',
        'tool_proficiencies',
        'features_and_traits',
        'attacks_and_spells',
        'equipment',
        'personality_traits',
        'ideals',
        'bonds',
        'flaws',
        'backstory',
        'spellcasting_class',
        'spell_attack_bonus',
        'spell_save_dc',
        'spell_slots',
        'spells_known',
    ];

    protected $casts = [
        'skill_proficiencies' => 'array',
        'skill_expertises' => 'array',
        'languages' => 'array',
        'armor_proficiencies' => 'array',
        'weapon_proficiencies' => 'array',
        'tool_proficiencies' => 'array',
        'features_and_traits' => 'array',
        'attacks_and_spells' => 'array',
        'equipment' => 'array',
        'spell_slots' => 'array',
        'spells_known' => 'array',
        'strength_save_proficiency' => 'boolean',
        'dexterity_save_proficiency' => 'boolean',
        'constitution_save_proficiency' => 'boolean',
        'intelligence_save_proficiency' => 'boolean',
        'wisdom_save_proficiency' => 'boolean',
        'charisma_save_proficiency' => 'boolean',
    ];

    // Calculate ability modifier
    public function getAbilityModifier($score)
    {
        return floor(($score - 10) / 2);
    }

    // Get proficiency bonus based on level
    public function getProficiencyBonus()
    {
        return ceil($this->level / 4) + 1;
    }

    // Calculate saving throw bonus
    public function getSavingThrowBonus($ability)
    {
        $modifier = $this->getAbilityModifier($this->{$ability});
        $proficient = $this->{$ability . '_save_proficiency'};
        return $modifier + ($proficient ? $this->getProficiencyBonus() : 0);
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
