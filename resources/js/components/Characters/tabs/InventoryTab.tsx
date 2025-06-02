import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompendiumItem, CompendiumFeat } from '@/types';
import { CharacterFormData } from '../CharacterForm';
import { useCompendiumData, useSelectedCompendiumData } from '@/hooks/useCompendiumHooks';

interface InventoryTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
}

export default function InventoryTab({ data, setData }: InventoryTabProps) {
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('all');
  const [featSearchTerm, setFeatSearchTerm] = useState('');

  // Load items and feats dynamically
  const {
    data: availableItems,
    loading: itemsLoading,
    search: searchItems,
    filter: filterItems,
    hasMore: hasMoreItems,
    loadMore: loadMoreItems
  } = useCompendiumData<CompendiumItem>('/api/character-compendium/items', false);

  const {
    data: availableFeats,
    loading: featsLoading,
    search: searchFeats,
    hasMore: hasMoreFeats,
    loadMore: loadMoreFeats
  } = useCompendiumData<CompendiumFeat>('/api/character-compendium/feats', false);

  // Load selected items and feats
  const { data: selectedItemsData } = useSelectedCompendiumData<CompendiumItem>(
    '/api/character-compendium/selected-items',
    data.selected_item_ids,
    'items'
  );

  const { data: selectedFeatsData } = useSelectedCompendiumData<CompendiumFeat>(
    '/api/character-compendium/selected-feats',
    data.selected_feat_ids,
    'feats'
  );

  const handleItemSelection = (itemId: number, isSelected: boolean) => {
    if (isSelected) {
      setData('selected_item_ids', [...data.selected_item_ids, itemId]);
    } else {
      setData('selected_item_ids', data.selected_item_ids.filter(id => id !== itemId));
    }
  };

  const handleFeatSelection = (featId: number, isSelected: boolean) => {
    if (isSelected) {
      setData('selected_feat_ids', [...data.selected_feat_ids, featId]);
    } else {
      setData('selected_feat_ids', data.selected_feat_ids.filter(id => id !== featId));
    }
  };

  const handleItemSearch = (term: string) => {
    setItemSearchTerm(term);
    searchItems(term);
  };

  const handleItemTypeFilter = (type: string) => {
    setItemTypeFilter(type);
    if (type === 'all') {
      filterItems({});
    } else {
      filterItems({ type });
    }
  };

  const handleFeatSearch = (term: string) => {
    setFeatSearchTerm(term);
    searchFeats(term);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Items</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedItemsData.length > 0 ? (
            <div className="space-y-2">
              {selectedItemsData.map((item: CompendiumItem, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <span>{item.compendium_entry?.name || 'Unknown Item'}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleItemSelection(item.compendium_entry_id, false)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
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
                  onChange={(e) => handleItemSearch(e.target.value)}
                />
              </div>
              <Select value={itemTypeFilter} onValueChange={handleItemTypeFilter}>
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

            {itemsLoading && (
              <div className="text-center py-4">Loading items...</div>
            )}

            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableItems.length > 0 ? (
                availableItems.map((item: CompendiumItem) => {
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
                })
              ) : !itemsLoading && itemSearchTerm ? (
                <div className="text-center py-4 text-muted-foreground">
                  No items found for "{itemSearchTerm}"
                </div>
              ) : !itemsLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Use the search bar above to find items
                </div>
              ) : null}

              {hasMoreItems && !itemsLoading && (
                <div className="text-center py-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadMoreItems}
                  >
                    Load More Items
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Feats</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFeatsData.length > 0 ? (
            <div className="space-y-2">
              {selectedFeatsData.map((feat: CompendiumFeat, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <span>{feat.compendium_entry?.name || 'Unknown Feat'}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeatSelection(feat.compendium_entry_id, false)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No feats selected</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Feats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search feats..."
                value={featSearchTerm}
                onChange={(e) => handleFeatSearch(e.target.value)}
              />
            </div>

            {featsLoading && (
              <div className="text-center py-4">Loading feats...</div>
            )}

            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableFeats.length > 0 ? (
                availableFeats.map((feat: CompendiumFeat) => {
                  const isSelected = data.selected_feat_ids.includes(feat.compendium_entry_id);
                  return (
                    <div
                      key={feat.id}
                      className={`p-3 border rounded-lg ${
                        isSelected ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{feat.compendium_entry?.name}</span>
                            {feat.prerequisite && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                Prerequisite: {feat.prerequisite}
                              </span>
                            )}
                          </div>
                          {feat.compendium_entry?.text && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              {feat.compendium_entry.text.substring(0, 150)}...
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant={isSelected ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => handleFeatSelection(feat.compendium_entry_id, !isSelected)}
                        >
                          {isSelected ? 'Remove' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : !featsLoading && featSearchTerm ? (
                <div className="text-center py-4 text-muted-foreground">
                  No feats found for "{featSearchTerm}"
                </div>
              ) : !featsLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Use the search bar above to find feats
                </div>
              ) : null}

              {hasMoreFeats && !featsLoading && (
                <div className="text-center py-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadMoreFeats}
                  >
                    Load More Feats
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
