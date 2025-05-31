import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompendiumData } from '@/types';
import { CharacterFormData } from '../CharacterForm';

interface InventoryTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
  compendiumData: CompendiumData;
}

export default function InventoryTab({ data, setData, compendiumData }: InventoryTabProps) {
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('all');

  const handleItemSelection = (itemId: number, isSelected: boolean) => {
    if (isSelected) {
      setData('selected_item_ids', [...data.selected_item_ids, itemId]);
    } else {
      setData('selected_item_ids', data.selected_item_ids.filter(id => id !== itemId));
    }
  };

  const filteredItems = useMemo(() => {
    return compendiumData.items.filter(item => {
      const matchesSearch = !itemSearchTerm ||
        item.compendium_entry?.name.toLowerCase().includes(itemSearchTerm.toLowerCase());
      const matchesType = itemTypeFilter === 'all' ||
        item.type === itemTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [compendiumData.items, itemSearchTerm, itemTypeFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Items</CardTitle>
        </CardHeader>
        <CardContent>
          {data.selected_item_ids.length > 0 ? (
            <div className="space-y-2">
              {data.selected_item_ids.map((itemId, index) => {
                const item = compendiumData.items.find(i => i.compendium_entry_id === itemId);
                return (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span>{item?.compendium_entry?.name || 'Unknown Item'}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleItemSelection(itemId, false)}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No items selected</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search items..."
                  value={itemSearchTerm}
                  onChange={(e) => setItemSearchTerm(e.target.value)}
                />
              </div>
              <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="A">Ammunition</SelectItem>
                  <SelectItem value="G">Gear</SelectItem>
                  <SelectItem value="M">Melee Weapon</SelectItem>
                  <SelectItem value="R">Ranged Weapon</SelectItem>
                  <SelectItem value="LA">Light Armor</SelectItem>
                  <SelectItem value="MA">Medium Armor</SelectItem>
                  <SelectItem value="HA">Heavy Armor</SelectItem>
                  <SelectItem value="S">Shield</SelectItem>
                  <SelectItem value="RD">Rod</SelectItem>
                  <SelectItem value="ST">Staff</SelectItem>
                  <SelectItem value="WD">Wand</SelectItem>
                  <SelectItem value="RG">Ring</SelectItem>
                  <SelectItem value="P">Potion</SelectItem>
                  <SelectItem value="SC">Scroll</SelectItem>
                  <SelectItem value="W">Wondrous Item</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredItems.map((item) => {
                const isSelected = data.selected_item_ids.includes(item.compendium_entry_id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 border rounded-lg ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.compendium_entry?.name}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                            {item.type || 'Item'}
                          </span>
                          {item.magic && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                              Magic
                            </span>
                          )}
                          {item.weight && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-1 py-0.5 rounded">
                              {item.weight} lbs
                            </span>
                          )}
                        </div>
                        {item.compendium_entry?.text && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            {item.compendium_entry.text.substring(0, 150)}...
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant={isSelected ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleItemSelection(item.compendium_entry_id, !isSelected)}
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
