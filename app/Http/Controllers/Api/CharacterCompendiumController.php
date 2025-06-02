<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompendiumRace;
use App\Models\CompendiumDndClass;
use App\Models\CompendiumBackground;
use App\Models\CompendiumSpell;
use App\Models\CompendiumFeat;
use App\Models\CompendiumItem;
use Illuminate\Http\Request;

class CharacterCompendiumController extends Controller
{
    /**
     * Get races for character creation/editing
     */
    public function races()
    {
        return response()->json([
            'races' => CompendiumRace::with('compendiumEntry')
                ->whereHas('compendiumEntry', function($q) {
                    $q->orderBy('name');
                })->get()
        ]);
    }

    /**
     * Get classes for character creation/editing
     */
    public function classes()
    {
        return response()->json([
            'classes' => CompendiumDndClass::with(['compendiumEntry', 'subclasses.compendiumEntry'])
                ->whereHas('compendiumEntry', function($q) {
                    $q->orderBy('name');
                })->get()
        ]);
    }

    /**
     * Get backgrounds for character creation/editing
     */
    public function backgrounds()
    {
        return response()->json([
            'backgrounds' => CompendiumBackground::with('compendiumEntry')
                ->whereHas('compendiumEntry', function($q) {
                    $q->orderBy('name');
                })->get()
        ]);
    }

    /**
     * Get spells with search and pagination
     */
    public function spells(Request $request)
    {
        $query = CompendiumSpell::with('compendiumEntry')
            ->whereHas('compendiumEntry', function($q) use ($request) {
                if ($request->has('search')) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                }
                $q->orderBy('name');
            });

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        if ($request->has('school')) {
            $query->where('school', $request->school);
        }

        $spells = $query->paginate($request->get('per_page', 20));

        return response()->json($spells);
    }

    /**
     * Get feats with search and pagination
     */
    public function feats(Request $request)
    {
        $query = CompendiumFeat::with('compendiumEntry')
            ->whereHas('compendiumEntry', function($q) use ($request) {
                if ($request->has('search')) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                }
                $q->orderBy('name');
            });

        $feats = $query->paginate($request->get('per_page', 20));

        return response()->json($feats);
    }

    /**
     * Get items with search and pagination
     */
    public function items(Request $request)
    {
        $query = CompendiumItem::with('compendiumEntry')
            ->whereHas('compendiumEntry', function($q) use ($request) {
                if ($request->has('search')) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                }
                $q->orderBy('name');
            });

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $items = $query->paginate($request->get('per_page', 20));

        return response()->json($items);
    }

    /**
     * Get selected spells by IDs
     */
    public function selectedSpells(Request $request)
    {
        $request->validate([
            'spell_ids' => 'required|array',
            'spell_ids.*' => 'integer|exists:compendium_entries,id'
        ]);

        $spells = CompendiumSpell::with('compendiumEntry')
            ->whereIn('compendium_entry_id', $request->spell_ids)
            ->get();

        return response()->json(['spells' => $spells]);
    }

    /**
     * Get selected feats by IDs
     */
    public function selectedFeats(Request $request)
    {
        $request->validate([
            'feat_ids' => 'required|array',
            'feat_ids.*' => 'integer|exists:compendium_entries,id'
        ]);

        $feats = CompendiumFeat::with('compendiumEntry')
            ->whereIn('compendium_entry_id', $request->feat_ids)
            ->get();

        return response()->json(['feats' => $feats]);
    }

    /**
     * Get selected items by IDs
     */
    public function selectedItems(Request $request)
    {
        $request->validate([
            'item_ids' => 'required|array',
            'item_ids.*' => 'integer|exists:compendium_entries,id'
        ]);

        $items = CompendiumItem::with('compendiumEntry')
            ->whereIn('compendium_entry_id', $request->item_ids)
            ->get();

        return response()->json(['items' => $items]);
    }
}
