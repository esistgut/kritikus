<?php

namespace App\Http\Controllers;

use App\Models\Character;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CharacterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Characters/Index', [
            'characters' => Character::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Characters/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class' => 'required|string|max:255',
            'race' => 'required|string|max:255',
            'background' => 'required|string|max:255',
            'level' => 'integer|min:1|max:20',
            'experience' => 'integer|min:0',
            'strength' => 'integer|min:1|max:30',
            'dexterity' => 'integer|min:1|max:30',
            'constitution' => 'integer|min:1|max:30',
            'intelligence' => 'integer|min:1|max:30',
            'wisdom' => 'integer|min:1|max:30',
            'charisma' => 'integer|min:1|max:30',
            'armor_class' => 'integer|min:1',
            'initiative' => 'integer',
            'speed' => 'integer|min:0',
            'hit_point_maximum' => 'integer|min:1',
            'current_hit_points' => 'integer|min:0',
            'temporary_hit_points' => 'integer|min:0',
            'hit_dice' => 'integer|min:0',
            'hit_dice_total' => 'integer|min:0',
            'strength_save_proficiency' => 'boolean',
            'dexterity_save_proficiency' => 'boolean',
            'constitution_save_proficiency' => 'boolean',
            'intelligence_save_proficiency' => 'boolean',
            'wisdom_save_proficiency' => 'boolean',
            'charisma_save_proficiency' => 'boolean',
            'skill_proficiencies' => 'array',
            'skill_expertises' => 'array',
            'languages' => 'array',
            'armor_proficiencies' => 'array',
            'weapon_proficiencies' => 'array',
            'tool_proficiencies' => 'array',
            'features_and_traits' => 'array',
            'attacks_and_spells' => 'array',
            'equipment' => 'array',
            'personality_traits' => 'nullable|string',
            'ideals' => 'nullable|string',
            'bonds' => 'nullable|string',
            'flaws' => 'nullable|string',
            'backstory' => 'nullable|string',
            'spellcasting_class' => 'nullable|string',
            'spell_attack_bonus' => 'integer',
            'spell_save_dc' => 'integer',
            'spell_slots' => 'array',
            'spells_known' => 'array',
        ]);

        Character::create($validated);

        return redirect()->route('characters.index')
            ->with('message', 'Character created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Character $character)
    {
        return Inertia::render('Characters/Show', [
            'character' => $character,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Character $character)
    {
        return Inertia::render('Characters/Edit', [
            'character' => $character,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Character $character)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class' => 'required|string|max:255',
            'race' => 'required|string|max:255',
            'background' => 'required|string|max:255',
            'level' => 'integer|min:1|max:20',
            'experience' => 'integer|min:0',
            'strength' => 'integer|min:1|max:30',
            'dexterity' => 'integer|min:1|max:30',
            'constitution' => 'integer|min:1|max:30',
            'intelligence' => 'integer|min:1|max:30',
            'wisdom' => 'integer|min:1|max:30',
            'charisma' => 'integer|min:1|max:30',
            'armor_class' => 'integer|min:1',
            'initiative' => 'integer',
            'speed' => 'integer|min:0',
            'hit_point_maximum' => 'integer|min:1',
            'current_hit_points' => 'integer|min:0',
            'temporary_hit_points' => 'integer|min:0',
            'hit_dice' => 'integer|min:0',
            'hit_dice_total' => 'integer|min:0',
            'strength_save_proficiency' => 'boolean',
            'dexterity_save_proficiency' => 'boolean',
            'constitution_save_proficiency' => 'boolean',
            'intelligence_save_proficiency' => 'boolean',
            'wisdom_save_proficiency' => 'boolean',
            'charisma_save_proficiency' => 'boolean',
            'skill_proficiencies' => 'array',
            'skill_expertises' => 'array',
            'languages' => 'array',
            'armor_proficiencies' => 'array',
            'weapon_proficiencies' => 'array',
            'tool_proficiencies' => 'array',
            'features_and_traits' => 'array',
            'attacks_and_spells' => 'array',
            'equipment' => 'array',
            'personality_traits' => 'nullable|string',
            'ideals' => 'nullable|string',
            'bonds' => 'nullable|string',
            'flaws' => 'nullable|string',
            'backstory' => 'nullable|string',
            'spellcasting_class' => 'nullable|string',
            'spell_attack_bonus' => 'integer',
            'spell_save_dc' => 'integer',
            'spell_slots' => 'array',
            'spells_known' => 'array',
        ]);

        $character->update($validated);

        return redirect()->route('characters.index')
            ->with('message', 'Character updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Character $character)
    {
        $character->delete();

        return redirect()->route('characters.index')
            ->with('message', 'Character deleted successfully!');
    }
}
