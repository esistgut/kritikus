import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CompendiumData } from '@/types';
import { CharacterFormData } from '../CharacterForm';

interface SpellsTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
  compendiumData: CompendiumData;
}

export default function SpellsTab({ data, setData, compendiumData }: SpellsTabProps) {
  const [spellSearchTerm, setSpellSearchTerm] = useState('');

  const handleSpellSelection = (spellId: number, isSelected: boolean) => {
    if (isSelected) {
      setData('selected_spell_ids', [...data.selected_spell_ids, spellId]);
    } else {
      setData('selected_spell_ids', data.selected_spell_ids.filter(id => id !== spellId));
    }
  };

  const filteredSpells = useMemo(() => {
    return compendiumData.spells.filter(spell =>
      spell.compendium_entry?.name.toLowerCase().includes(spellSearchTerm.toLowerCase())
    );
  }, [compendiumData.spells, spellSearchTerm]);

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

      <Card>
        <CardHeader>
          <CardTitle>Available Spells</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search spells..."
                value={spellSearchTerm}
                onChange={(e) => setSpellSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredSpells.map((spell) => {
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
