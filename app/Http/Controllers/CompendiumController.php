<?php

namespace App\Http\Controllers;

use App\Models\CompendiumEntry;
use App\Models\CompendiumSpell;
use App\Models\CompendiumItem;
use App\Models\CompendiumMonster;
use App\Models\CompendiumRace;
use App\Models\CompendiumDndClass;
use App\Models\CompendiumBackground;
use App\Models\CompendiumFeat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompendiumController extends Controller
{
    /**
     * Display the compendium index page
     */
    public function index(Request $request): Response
    {
        $query = CompendiumEntry::query();

        // Filter by type
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('entry_type', $request->type);
        }

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        // Filter by source
        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        $entries = $query->orderBy('name')->paginate($request->get('per_page', 20));

        // Get stats
        $stats = [
            'total' => CompendiumEntry::count(),
            'system' => CompendiumEntry::where('is_system', true)->count(),
            'user' => CompendiumEntry::where('is_system', false)->count(),
            'types' => [
                'spell' => CompendiumEntry::where('entry_type', 'spell')->count(),
                'item' => CompendiumEntry::where('entry_type', 'item')->count(),
                'monster' => CompendiumEntry::where('entry_type', 'monster')->count(),
                'race' => CompendiumEntry::where('entry_type', 'race')->count(),
                'class' => CompendiumEntry::where('entry_type', 'class')->count(),
                'background' => CompendiumEntry::where('entry_type', 'background')->count(),
                'feat' => CompendiumEntry::where('entry_type', 'feat')->count(),
            ]
        ];

        return Inertia::render('Compendium/Index', [
            'entries' => $entries,
            'filter' => $request->only(['type', 'source', 'search']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new compendium entry
     */
    public function create(): Response
    {
        return Inertia::render('Compendium/Form', [
            'isEdit' => false,
        ]);
    }

    /**
     * Store a newly created compendium entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'entry_type' => 'required|in:spell,item,monster,race,class,background,feat',
            'text' => 'required|string',
            'source' => 'nullable|string|max:255',
            'specific_data' => 'nullable|array',
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Create the main entry
            $entry = CompendiumEntry::create([
                'name' => $validated['name'],
                'entry_type' => $validated['entry_type'],
                'text' => $validated['text'],
                'source' => $validated['source'] ?? 'Custom',
                'is_system' => false, // User entries are never system entries
                'user_id' => $request->user()->id,
            ]);

            // Create the specific data entry
            $this->createSpecificData($entry, $validated['entry_type'], $validated['specific_data'] ?? []);
        });

        return redirect()->route('compendium.index')->with('success', 'Compendium entry created successfully!');
    }

    /**
     * Display the specified compendium entry
     */
    public function show(CompendiumEntry $compendium): Response
    {
        // Load the specific data based on entry type
        $relationshipName = $this->getRelationshipName($compendium->entry_type);
        if ($relationshipName) {
            $compendium->load($relationshipName);
        }

        return Inertia::render('Compendium/Show', [
            'entry' => $compendium,
        ]);
    }

    /**
     * Show the form for editing the specified compendium entry
     */
    public function edit(CompendiumEntry $compendium): Response
    {
        // Only allow editing of user entries
        if ($compendium->is_system) {
            abort(403, 'System entries cannot be edited.');
        }

        // Load the specific data
        $compendium->load($this->getRelationshipName($compendium->entry_type));

        return Inertia::render('Compendium/Form', [
            'entry' => $compendium,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified compendium entry
     */
    public function update(Request $request, CompendiumEntry $compendium)
    {
        // Only allow updating of user entries
        if ($compendium->is_system) {
            abort(403, 'System entries cannot be modified.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'entry_type' => ['required', Rule::in(['spell', 'item', 'monster', 'race', 'class', 'background', 'feat'])],
            'text' => 'required|string',
            'source' => 'nullable|string|max:255',
            'specific_data' => 'nullable|array',
        ]);

        DB::transaction(function () use ($validated, $compendium) {
            // Update the main entry
            $compendium->update([
                'name' => $validated['name'],
                'entry_type' => $validated['entry_type'],
                'text' => $validated['text'],
                'source' => $validated['source'] ?? 'Custom',
            ]);

            // Update the specific data
            $this->updateSpecificData($compendium, $validated['entry_type'], $validated['specific_data'] ?? []);
        });

        return redirect()->route('compendium.show', $compendium)->with('success', 'Compendium entry updated successfully!');
    }

    /**
     * Remove the specified compendium entry
     */
    public function destroy(CompendiumEntry $compendium)
    {
        // Only allow deleting of user entries
        if ($compendium->is_system) {
            abort(403, 'System entries cannot be deleted.');
        }

        $compendium->delete();

        return redirect()->route('compendium.index')->with('success', 'Compendium entry deleted successfully!');
    }

    /**
     * Get entries by type for character creation/editing
     */
    public function getByType(Request $request, string $type)
    {
        $query = CompendiumEntry::where('entry_type', $type);

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        $entries = $query->orderBy('name')->get(['id', 'name', 'source', 'is_system']);

        return response()->json($entries);
    }

    /**
     * Create specific data entry based on type
     */
    private function createSpecificData(CompendiumEntry $entry, string $type, array $data): void
    {
        $specificData = array_merge(['compendium_entry_id' => $entry->id], $data);

        switch ($type) {
            case 'spell':
                // Ensure required fields are always provided for spells with defaults
                $specificData['level'] = $specificData['level'] ?? 0;
                $specificData['school'] = $specificData['school'] ?? 'evocation';
                CompendiumSpell::create($specificData);
                break;
            case 'item':
                // Ensure required fields are always provided for items with defaults
                $specificData['type'] = $specificData['type'] ?? 'misc';
                CompendiumItem::create($specificData);
                break;
            case 'monster':
                // Ensure required fields are always provided for monsters with defaults
                $specificData['type'] = $specificData['type'] ?? 'humanoid';
                $specificData['size'] = $specificData['size'] ?? 'Medium';
                CompendiumMonster::create($specificData);
                break;
            case 'race':
                CompendiumRace::create($specificData);
                break;
            case 'class':
                CompendiumDndClass::create($specificData);
                break;
            case 'background':
                CompendiumBackground::create($specificData);
                break;
            case 'feat':
                CompendiumFeat::create($specificData);
                break;
        }
    }

    /**
     * Update specific data entry based on type
     */
    private function updateSpecificData(CompendiumEntry $entry, string $type, array $data): void
    {
        $relationshipName = $this->getRelationshipName($type);

        if ($entry->{$relationshipName}) {
            $entry->{$relationshipName}->update($data);
        } else {
            $this->createSpecificData($entry, $type, $data);
        }
    }

    /**
     * Get the relationship name for a given entry type
     */
    private function getRelationshipName(?string $entryType): string
    {
        if ($entryType === null) {
            return '';
        }

        return match($entryType) {
            'spell' => 'spell',
            'item' => 'item',
            'monster' => 'monster',
            'race' => 'race',
            'class' => 'dndClass',
            'background' => 'background',
            'feat' => 'feat',
            default => $entryType,
        };
    }
}
