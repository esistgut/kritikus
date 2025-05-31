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
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->where('source', $request->source);
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        // Include specific data
        $query->with(['spell', 'item', 'monster', 'race', 'dndClass', 'background', 'feat']);

        $entries = $query->paginate($request->get('per_page', 20));

        return Inertia::render('Compendium/Index', [
            'entries' => $entries,
            'filters' => $request->only(['type', 'source', 'search']),
            'stats' => [
                'total_entries' => CompendiumEntry::count(),
                'system_entries' => CompendiumEntry::where('source', 'system')->count(),
                'user_entries' => CompendiumEntry::where('source', 'user')->count(),
                'by_type' => [
                    'spells' => CompendiumSpell::count(),
                    'items' => CompendiumItem::count(),
                    'monsters' => CompendiumMonster::count(),
                    'races' => CompendiumRace::count(),
                    'classes' => CompendiumDndClass::count(),
                    'backgrounds' => CompendiumBackground::count(),
                    'feats' => CompendiumFeat::count(),
                ]
            ]
        ]);
    }

    /**
     * Display a specific compendium entry
     */
    public function show(CompendiumEntry $entry): Response
    {
        $entry->load(['spell', 'item', 'monster', 'race', 'dndClass', 'background', 'feat']);

        return Inertia::render('Compendium/Show', [
            'entry' => $entry,
            'specific_data' => $entry->specific_data
        ]);
    }

    /**
     * Display spells page
     */
    public function spells(Request $request): Response
    {
        $query = CompendiumSpell::with('compendiumEntry');

        // Filter by level
        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        // Filter by school
        if ($request->has('school')) {
            $query->where('school', 'LIKE', '%' . $request->school . '%');
        }

        // Filter by class
        if ($request->has('classes')) {
            $query->where('classes', 'LIKE', '%' . $request->classes . '%');
        }

        // Search by name
        if ($request->has('search')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('source', $request->source);
            });
        }

        $spells = $query->paginate($request->get('per_page', 20));

        return Inertia::render('Compendium/Spells', [
            'spells' => $spells,
            'filters' => $request->only(['level', 'school', 'classes', 'search', 'source'])
        ]);
    }

    /**
     * Get all items with filtering
     */
    public function items(Request $request): JsonResponse
    {
        $query = CompendiumItem::with('compendiumEntry');

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', 'LIKE', '%' . $request->type . '%');
        }

        // Filter by rarity
        if ($request->has('rarity')) {
            $query->where('rarity', 'LIKE', '%' . $request->rarity . '%');
        }

        // Search by name
        if ($request->has('search')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('source', $request->source);
            });
        }

        $items = $query->paginate($request->get('per_page', 20));

        return response()->json($items);
    }

    /**
     * Get all monsters with filtering
     */
    public function monsters(Request $request): JsonResponse
    {
        $query = CompendiumMonster::with('compendiumEntry');

        // Filter by CR
        if ($request->has('cr')) {
            $query->where('cr', $request->cr);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', 'LIKE', '%' . $request->type . '%');
        }

        // Filter by size
        if ($request->has('size')) {
            $query->where('size', 'LIKE', '%' . $request->size . '%');
        }

        // Search by name
        if ($request->has('search')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('source', $request->source);
            });
        }

        $monsters = $query->paginate($request->get('per_page', 20));

        return response()->json($monsters);
    }

    /**
     * Get all races
     */
    public function races(Request $request): JsonResponse
    {
        $query = CompendiumRace::with('compendiumEntry');

        // Search by name
        if ($request->has('search')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('source', $request->source);
            });
        }

        $races = $query->paginate($request->get('per_page', 20));

        return response()->json($races);
    }

    /**
     * Get all classes
     */
    public function classes(Request $request): JsonResponse
    {
        $query = CompendiumDndClass::with('compendiumEntry');

        // Search by name
        if ($request->has('search')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('source', $request->source);
            });
        }

        $classes = $query->paginate($request->get('per_page', 20));

        return response()->json($classes);
    }

    /**
     * Get all backgrounds
     */
    public function backgrounds(Request $request): JsonResponse
    {
        $query = CompendiumBackground::with('compendiumEntry');

        // Search by name
        if ($request->has('search')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('source', $request->source);
            });
        }

        $backgrounds = $query->paginate($request->get('per_page', 20));

        return response()->json($backgrounds);
    }

    /**
     * Get all feats
     */
    public function feats(Request $request): JsonResponse
    {
        $query = CompendiumFeat::with('compendiumEntry');

        // Search by name
        if ($request->has('search')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by source (system/user)
        if ($request->has('source')) {
            $query->whereHas('compendiumEntry', function ($q) use ($request) {
                $q->where('source', $request->source);
            });
        }

        $feats = $query->paginate($request->get('per_page', 20));

        return response()->json($feats);
    }

    /**
     * Get statistics about the compendium
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_entries' => CompendiumEntry::count(),
            'system_entries' => CompendiumEntry::where('source', 'system')->count(),
            'user_entries' => CompendiumEntry::where('source', 'user')->count(),
            'by_type' => [
                'spells' => CompendiumSpell::count(),
                'items' => CompendiumItem::count(),
                'monsters' => CompendiumMonster::count(),
                'races' => CompendiumRace::count(),
                'classes' => CompendiumDndClass::count(),
                'backgrounds' => CompendiumBackground::count(),
                'feats' => CompendiumFeat::count(),
            ]
        ]);
    }
}
