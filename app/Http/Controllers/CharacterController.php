<?php

namespace App\Http\Controllers;

use App\Models\Character;
use App\Models\CompendiumEntry;
use App\Models\CompendiumRace;
use App\Models\CompendiumDndClass;
use App\Models\CompendiumBackground;
use App\Models\CompendiumSpell;
use App\Models\CompendiumFeat;
use App\Models\CompendiumItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class CharacterController extends Controller
{
    /**
     * Create the controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Character::class, 'character');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Character::class);

        return Inertia::render('Characters/Index', [
            'characters' => Auth::user()->characters()
                ->with(['race', 'character_class', 'subclass', 'background'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Characters/Create', [
            'compendiumData' => [
                'races' => CompendiumRace::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'classes' => CompendiumDndClass::with(['compendiumEntry', 'subclasses.compendiumEntry'])
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'backgrounds' => CompendiumBackground::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'spells' => CompendiumSpell::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'feats' => CompendiumFeat::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'items' => CompendiumItem::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'race_id' => 'required|exists:compendium_entries,id',
            'class_id' => 'required|exists:compendium_entries,id',
            'subclass_id' => 'nullable|exists:compendium_entries,id',
            'background_id' => 'required|exists:compendium_entries,id',
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
            'selected_spell_ids' => 'array',
            'selected_spell_ids.*' => 'exists:compendium_entries,id',
            'selected_feat_ids' => 'array',
            'selected_feat_ids.*' => 'exists:compendium_entries,id',
            'selected_item_ids' => 'array',
            'selected_item_ids.*' => 'exists:compendium_entries,id',
        ]);

        Auth::user()->characters()->create($validated);

        return redirect()->route('characters.index')
            ->with('message', 'Character created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Character $character)
    {
        $this->authorize('view', $character);

        // Load the character with compendium relationships and their specific data
        $character->load([
            'race',
            'character_class.dndClass',
            'subclass.subclass',
            'background'
        ]);

        // Add selected items as attributes
        $character->selectedSpells = $character->selectedSpells();
        $character->selectedFeats = $character->selectedFeats();
        $character->selectedItems = $character->selectedItems();

        return Inertia::render('Characters/Show', [
            'character' => $character,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Character $character)
    {
        $this->authorize('update', $character);

        // Load the character with compendium relationships and their specific data
        $character->load([
            'race',
            'character_class.dndClass',
            'subclass.subclass',
            'background'
        ]);

        // Add selected items as attributes
        $character->selectedSpells = $character->selectedSpells();
        $character->selectedFeats = $character->selectedFeats();
        $character->selectedItems = $character->selectedItems();

        return Inertia::render('Characters/Edit', [
            'character' => $character,
            'compendiumData' => [
                'races' => CompendiumRace::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'classes' => CompendiumDndClass::with(['compendiumEntry', 'subclasses.compendiumEntry'])
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'backgrounds' => CompendiumBackground::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'spells' => CompendiumSpell::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'feats' => CompendiumFeat::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
                'items' => CompendiumItem::with('compendiumEntry')
                    ->whereHas('compendiumEntry', function($q) {
                        $q->orderBy('name');
                    })->get(),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Character $character)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'race_id' => 'required|exists:compendium_entries,id',
            'class_id' => 'required|exists:compendium_entries,id',
            'subclass_id' => 'nullable|exists:compendium_entries,id',
            'background_id' => 'required|exists:compendium_entries,id',
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
            'selected_spell_ids' => 'array',
            'selected_spell_ids.*' => 'exists:compendium_entries,id',
            'selected_feat_ids' => 'array',
            'selected_feat_ids.*' => 'exists:compendium_entries,id',
            'selected_item_ids' => 'array',
            'selected_item_ids.*' => 'exists:compendium_entries,id',
            'tab' => 'nullable|string|in:overview,abilities,combat,spells,inventory,skills,character',
        ]);

        $character->update($validated);

        // Get the tab parameter from the query string to maintain tab context
        $tab = $request->query('tab', 'overview');

        return redirect()->route('characters.show', ['character' => $character->id, 'tab' => $tab])
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
