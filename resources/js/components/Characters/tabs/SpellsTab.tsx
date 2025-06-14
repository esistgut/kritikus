import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CompendiumSpell } from '@/types';
import { CharacterFormData } from '../CharacterForm';
import SpellList from '../SpellList';
import { useCompendiumData, useSelectedCompendiumData } from '@/hooks/useCompendiumHooks';

interface SpellsTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
}

export default function SpellsTab({ data, setData }: SpellsTabProps) {
  const [spellSearchTerm, setSpellSearchTerm] = useState('');

  // Load spells dynamically with search
  const {
    data: availableSpells,
    loading: spellsLoading,
    search: searchSpells,
    hasMore,
    loadMore
  } = useCompendiumData<CompendiumSpell>('/api/character-compendium/spells', false);

  // Load selected spells
  const {
    data: selectedSpellsData
  } = useSelectedCompendiumData<CompendiumSpell>(
    '/api/character-compendium/selected-spells',
    data.selected_spell_ids,
    'spells'
  );

  const handleSpellSelection = (spellId: number, isSelected: boolean) => {
    if (isSelected) {
      setData('selected_spell_ids', [...data.selected_spell_ids, spellId]);
    } else {
      setData('selected_spell_ids', data.selected_spell_ids.filter(id => id !== spellId));
    }
  };

  const handleSpellSearch = (term: string) => {
    setSpellSearchTerm(term);
    searchSpells(term); // Trigger search with new term
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Spellcasting Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="spellcasting_class">Spellcasting Class</Label>
              <Input
                id="spellcasting_class"
                value={data.spellcasting_class}
                onChange={e => setData('spellcasting_class', e.target.value)}
                placeholder="e.g., Wizard, Cleric, Sorcerer"
              />
            </div>
            <div>
              <Label htmlFor="spell_attack_bonus">Spell Attack Bonus</Label>
              <Input
                id="spell_attack_bonus"
                type="number"
                value={data.spell_attack_bonus}
                onChange={e => setData('spell_attack_bonus', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="spell_save_dc">Spell Save DC</Label>
              <Input
                id="spell_save_dc"
                type="number"
                min="8"
                value={data.spell_save_dc}
                onChange={e => setData('spell_save_dc', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Spells Section */}
      <SpellList
        title="Selected Spells"
        spells={selectedSpellsData}
        showRemoveButton={true}
        onRemoveSpell={(spellId) => handleSpellSelection(spellId, false)}
        emptyMessage="No spells selected. Choose spells from the 'Available Spells' section below."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available Spells</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search spells by name or school (e.g., 'fire', 'evocation')..."
                value={spellSearchTerm}
                onChange={(e) => handleSpellSearch(e.target.value)}
              />
              {spellSearchTerm && (
                <p className="text-sm text-muted-foreground mt-1">
                  Showing results for "{spellSearchTerm}"
                </p>
              )}
            </div>

            {spellsLoading && (
              <div className="text-center py-4">Loading spells...</div>
            )}

            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableSpells.length === 0 && !spellsLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  {spellSearchTerm ? `No spells found for "${spellSearchTerm}"` : 'Type to search for spells...'}
                </div>
              )}

              {availableSpells.map((spell: CompendiumSpell) => {
                const isSelected = data.selected_spell_ids.includes(spell.compendium_entry_id);
                return (
                  <div
                    key={spell.id}
                    className={`p-3 border rounded-lg ${
                      isSelected ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{spell.compendium_entry?.name}</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Level {spell.level}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {spell.school}
                          </span>
                          {spell.ritual && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Ritual
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {spell.compendium_entry?.text?.substring(0, 200)}...
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={isSelected ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleSpellSelection(spell.compendium_entry_id, !isSelected)}
                      >
                        {isSelected ? 'Remove' : 'Add'}
                      </Button>
                    </div>
                  </div>
                );
              })}

              {hasMore && !spellsLoading && (
                <div className="text-center py-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadMore}
                  >
                    Load More Results ({availableSpells.length} shown)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
