import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/Layouts/AppLayout';
import { Character, PageProps, CompendiumData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import React, { useState } from 'react';

interface CharacterEditProps extends PageProps {
  character: Character;
  compendiumData: CompendiumData;
}

const SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'
];

const LANGUAGES = [
  'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

export default function Edit({ character, compendiumData }: CharacterEditProps) {
  // Get the tab parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'basic';

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const { data, setData, put, processing, errors } = useForm({
    name: character.name,
    race_id: character.race_id,
    class_id: character.class_id,
    background_id: character.background_id,
    selected_spell_ids: character.selected_spell_ids || [],
    selected_feat_ids: character.selected_feat_ids || [],
    selected_item_ids: character.selected_item_ids || [],
    level: character.level,
    experience: character.experience,
    strength: character.strength,
    dexterity: character.dexterity,
    constitution: character.constitution,
    intelligence: character.intelligence,
    wisdom: character.wisdom,
    charisma: character.charisma,
    armor_class: character.armor_class,
    initiative: character.initiative,
    speed: character.speed,
    hit_point_maximum: character.hit_point_maximum,
    current_hit_points: character.current_hit_points,
    temporary_hit_points: character.temporary_hit_points,
    hit_dice: character.hit_dice,
    hit_dice_total: character.hit_dice_total,
    strength_save_proficiency: character.strength_save_proficiency,
    dexterity_save_proficiency: character.dexterity_save_proficiency,
    constitution_save_proficiency: character.constitution_save_proficiency,
    intelligence_save_proficiency: character.intelligence_save_proficiency,
    wisdom_save_proficiency: character.wisdom_save_proficiency,
    charisma_save_proficiency: character.charisma_save_proficiency,
    skill_proficiencies: character.skill_proficiencies,
    skill_expertises: character.skill_expertises,
    languages: character.languages,
    armor_proficiencies: character.armor_proficiencies,
    weapon_proficiencies: character.weapon_proficiencies,
    tool_proficiencies: character.tool_proficiencies,
    features_and_traits: character.features_and_traits,
    attacks_and_spells: character.attacks_and_spells,
    equipment: character.equipment,
    personality_traits: character.personality_traits || '',
    ideals: character.ideals || '',
    bonds: character.bonds || '',
    flaws: character.flaws || '',
    backstory: character.backstory || '',
    spellcasting_class: character.spellcasting_class || '',
    spell_attack_bonus: character.spell_attack_bonus,
    spell_save_dc: character.spell_save_dc,
    spell_slots: character.spell_slots,
  });

  // Map Edit tabs back to Show tabs
  const getShowTab = (editTab: string): string => {
    const tabMapping: { [key: string]: string } = {
      'basic': 'overview',
      'abilities': 'abilities',
      'combat': 'combat',
      'spells': 'spells',
      'inventory': 'inventory',
      'skills': 'skills',
      'character': 'character'
    };
    return tabMapping[editTab] || 'overview';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log form data for debugging
    console.log('Form submission data:', data);
    console.log('Current active tab:', activeTab);
    console.log('Selected item IDs:', data.selected_item_ids);

    // Get the tab parameter based on current active tab
    const tabToSend = getShowTab(activeTab);

    // Send the tab as a query parameter in the URL
    put(`/characters/${character.id}?tab=${tabToSend}`, {
      onSuccess: () => {
        console.log('Form submitted successfully');
      },
      onError: (errors) => {
        console.log('Form submission errors:', errors);
      }
    });
  };

  const getAbilityModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  const handleSkillProficiencyChange = (skill: string, checked: boolean) => {
    if (checked) {
      setData('skill_proficiencies', [...data.skill_proficiencies, skill]);
    } else {
      setData('skill_proficiencies', data.skill_proficiencies.filter(s => s !== skill));
    }
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setData('languages', [...data.languages, language]);
    } else {
      setData('languages', data.languages.filter(l => l !== language));
    }
  };

  // Spell filtering state
  const [spellSearch, setSpellSearch] = React.useState('');
  const [spellLevelFilter, setSpellLevelFilter] = React.useState('all');
  const [spellSchoolFilter, setSpellSchoolFilter] = React.useState('all');

  // Item search and filter state
  const [itemSearchTerm, setItemSearchTerm] = React.useState('');
  const [itemTypeFilter, setItemTypeFilter] = React.useState('all');

  // Filter spells based on search and filters
  const filteredSpells = React.useMemo(() => {
    return compendiumData.spells.filter(spell => {
      const matchesSearch = !spellSearch ||
        spell.compendium_entry?.name.toLowerCase().includes(spellSearch.toLowerCase());
      const matchesLevel = spellLevelFilter === 'all' ||
        spell.level.toString() === spellLevelFilter;
      const matchesSchool = spellSchoolFilter === 'all' ||
        spell.school.toLowerCase() === spellSchoolFilter.toLowerCase();

      return matchesSearch && matchesLevel && matchesSchool;
    });
  }, [compendiumData.spells, spellSearch, spellLevelFilter, spellSchoolFilter]);

  // Filter items based on search and filters
  const filteredItems = React.useMemo(() => {
    return compendiumData.items.filter(item => {
      const matchesSearch = !itemSearchTerm ||
        item.compendium_entry?.name.toLowerCase().includes(itemSearchTerm.toLowerCase());
      const matchesType = itemTypeFilter === 'all' ||
        item.type === itemTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [compendiumData.items, itemSearchTerm, itemTypeFilter]);



  return (
    <AppLayout>
      <Head title={`Edit ${character.name}`} />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/characters/${character.id}?tab=${getShowTab(activeTab)}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Character
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit {character.name}</h1>
              <p className="text-muted-foreground">Update your D&D 2024 character sheet</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="abilities">Abilities</TabsTrigger>
                <TabsTrigger value="combat">Combat</TabsTrigger>
                <TabsTrigger value="spells">Spells</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="skills">Skills & Proficiencies</TabsTrigger>
                <TabsTrigger value="character">Character Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Character Name *</Label>
                        <Input
                          id="name"
                          value={data.name}
                          onChange={e => setData('name', e.target.value)}
                          required
                        />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="class">Class *</Label>
                        <Select
                          value={data.class_id.toString()}
                          onValueChange={(value) => setData('class_id', parseInt(value))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            {compendiumData.classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.compendium_entry_id.toString()}>
                                {cls.compendium_entry?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.class_id && <p className="text-sm text-destructive mt-1">{errors.class_id}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="race">Race *</Label>
                        <Select
                          value={data.race_id.toString()}
                          onValueChange={(value) => setData('race_id', parseInt(value))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a race" />
                          </SelectTrigger>
                          <SelectContent>
                            {compendiumData.races.map((race) => (
                              <SelectItem key={race.id} value={race.compendium_entry_id.toString()}>
                                {race.compendium_entry?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.race_id && <p className="text-sm text-destructive mt-1">{errors.race_id}</p>}
                      </div>
                      <div>
                        <Label htmlFor="background">Background *</Label>
                        <Select
                          value={data.background_id.toString()}
                          onValueChange={(value) => setData('background_id', parseInt(value))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a background" />
                          </SelectTrigger>
                          <SelectContent>
                            {compendiumData.backgrounds.map((background) => (
                              <SelectItem key={background.id} value={background.compendium_entry_id.toString()}>
                                {background.compendium_entry?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.background_id && <p className="text-sm text-destructive mt-1">{errors.background_id}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <Input
                          id="level"
                          type="number"
                          min="1"
                          max="20"
                          value={data.level}
                          onChange={e => setData('level', parseInt(e.target.value))}
                        />
                        {errors.level && <p className="text-sm text-destructive mt-1">{errors.level}</p>}
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience Points</Label>
                        <Input
                          id="experience"
                          type="number"
                          min="0"
                          value={data.experience}
                          onChange={e => setData('experience', parseInt(e.target.value))}
                        />
                        {errors.experience && <p className="text-sm text-destructive mt-1">{errors.experience}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="abilities">
                <Card>
                  <CardHeader>
                    <CardTitle>Ability Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
                        <div key={ability} className="space-y-2">
                          <Label htmlFor={ability} className="capitalize">
                            {ability} (Modifier: {getAbilityModifier(data[ability as keyof typeof data] as number) >= 0 ? '+' : ''}{getAbilityModifier(data[ability as keyof typeof data] as number)})
                          </Label>
                          <Input
                            id={ability}
                            type="number"
                            min="1"
                            max="30"
                            value={data[ability as keyof typeof data] as number}
                            onChange={e => setData(ability as keyof typeof data, parseInt(e.target.value) as any)}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Saving Throw Proficiencies</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
                          <div key={ability} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${ability}_save`}
                              checked={data[`${ability}_save_proficiency` as keyof typeof data] as boolean}
                              onCheckedChange={(checked) =>
                                setData(`${ability}_save_proficiency` as keyof typeof data, checked as any)
                              }
                            />
                            <Label htmlFor={`${ability}_save`} className="capitalize">
                              {ability}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="combat">
                <Card>
                  <CardHeader>
                    <CardTitle>Combat Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="armor_class">Armor Class</Label>
                        <Input
                          id="armor_class"
                          type="number"
                          min="1"
                          value={data.armor_class}
                          onChange={e => setData('armor_class', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="initiative">Initiative</Label>
                        <Input
                          id="initiative"
                          type="number"
                          value={data.initiative}
                          onChange={e => setData('initiative', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="speed">Speed</Label>
                        <Input
                          id="speed"
                          type="number"
                          min="0"
                          value={data.speed}
                          onChange={e => setData('speed', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="hit_point_maximum">Hit Point Maximum</Label>
                        <Input
                          id="hit_point_maximum"
                          type="number"
                          min="1"
                          value={data.hit_point_maximum}
                          onChange={e => setData('hit_point_maximum', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="current_hit_points">Current Hit Points</Label>
                        <Input
                          id="current_hit_points"
                          type="number"
                          min="0"
                          value={data.current_hit_points}
                          onChange={e => setData('current_hit_points', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="temporary_hit_points">Temporary Hit Points</Label>
                        <Input
                          id="temporary_hit_points"
                          type="number"
                          min="0"
                          value={data.temporary_hit_points}
                          onChange={e => setData('temporary_hit_points', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hit_dice">Hit Dice Remaining</Label>
                        <Input
                          id="hit_dice"
                          type="number"
                          min="0"
                          value={data.hit_dice}
                          onChange={e => setData('hit_dice', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Proficiencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {SKILLS.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill_${skill}`}
                              checked={data.skill_proficiencies.includes(skill)}
                              onCheckedChange={(checked) => handleSkillProficiencyChange(skill, checked as boolean)}
                            />
                            <Label htmlFor={`skill_${skill}`}>{skill}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {LANGUAGES.map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={`language_${language}`}
                              checked={data.languages.includes(language)}
                              onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                            />
                            <Label htmlFor={`language_${language}`}>{language}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="spells">
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
                            onChange={e => setData('spell_attack_bonus', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="spell_save_dc">Spell Save DC</Label>
                          <Input
                            id="spell_save_dc"
                            type="number"
                            min="8"
                            value={data.spell_save_dc}
                            onChange={e => setData('spell_save_dc', parseInt(e.target.value) || 8)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Spell Slots Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {data.spell_slots && data.spell_slots.length > 0 ? (
                          data.spell_slots.map((slot, index) => (
                            <div key={slot.level} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">Level {slot.level}</span>
                                <div className="flex space-x-1">
                                  {[...Array(slot.total)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-4 h-4 rounded-full border-2 ${
                                        i < slot.used
                                          ? 'bg-gray-400 border-gray-400'
                                          : 'bg-purple-500 border-purple-500'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {slot.total - slot.used}/{slot.total}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSlots = [...data.spell_slots];
                                    if (newSlots[index].used > 0) {
                                      newSlots[index].used--;
                                      setData('spell_slots', newSlots);
                                    }
                                  }}
                                  disabled={slot.used === 0}
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  min="0"
                                  max={slot.total}
                                  value={slot.used}
                                  onChange={(e) => {
                                    const used = Math.min(Math.max(0, parseInt(e.target.value) || 0), slot.total);
                                    const newSlots = [...data.spell_slots];
                                    newSlots[index].used = used;
                                    setData('spell_slots', newSlots);
                                  }}
                                  className="w-16 text-center"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSlots = [...data.spell_slots];
                                    if (newSlots[index].used < slot.total) {
                                      newSlots[index].used++;
                                      setData('spell_slots', newSlots);
                                    }
                                  }}
                                  disabled={slot.used >= slot.total}
                                >
                                  +
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSlots = [...data.spell_slots];
                                    newSlots[index].total++;
                                    setData('spell_slots', newSlots);
                                  }}
                                >
                                  Add Slot
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSlots = [...data.spell_slots];
                                    if (newSlots[index].total > 0) {
                                      newSlots[index].total--;
                                      newSlots[index].used = Math.min(newSlots[index].used, newSlots[index].total);
                                      setData('spell_slots', newSlots);
                                    }
                                  }}
                                  disabled={slot.total === 0}
                                >
                                  Remove Slot
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <p>No spell slots configured.</p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setData('spell_slots', [
                                  { level: 1, total: 2, used: 0 }
                                ]);
                              }}
                              className="mt-2"
                            >
                              Add First Spell Slot Level
                            </Button>
                          </div>
                        )}

                        {data.spell_slots && data.spell_slots.length > 0 && (
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const maxLevel = Math.max(...data.spell_slots.map(slot => slot.level));
                                const newLevel = Math.min(maxLevel + 1, 9);
                                if (newLevel <= 9) {
                                  setData('spell_slots', [
                                    ...data.spell_slots,
                                    { level: newLevel, total: 1, used: 0 }
                                  ]);
                                }
                              }}
                              disabled={data.spell_slots.length >= 9 || Math.max(...data.spell_slots.map(slot => slot.level)) >= 9}
                            >
                              Add New Spell Level
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newSlots = data.spell_slots.map(slot => ({ ...slot, used: 0 }));
                                setData('spell_slots', newSlots);
                              }}
                            >
                              Reset All Slots
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Spells Known</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Selected Spells Display */}
                        {data.selected_spell_ids && data.selected_spell_ids.length > 0 ? (
                          <div className="space-y-3">
                            {data.selected_spell_ids.map((spellId) => {
                              const spellEntry = compendiumData.spells.find(s => s.compendium_entry_id === spellId);
                              if (!spellEntry) return null;

                              return (
                                <div key={spellId} className="p-4 border rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-medium">{spellEntry.compendium_entry?.name}</h4>
                                        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                          Level {spellEntry.level}
                                        </span>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                          {spellEntry.school}
                                        </span>
                                        {spellEntry.ritual && (
                                          <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                            Ritual
                                          </span>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-2">
                                        <div><strong>Casting Time:</strong> {spellEntry.casting_time || 'Unknown'}</div>
                                        <div><strong>Range:</strong> {spellEntry.range || 'Unknown'}</div>
                                        <div><strong>Components:</strong> {spellEntry.components || 'Unknown'}</div>
                                        <div><strong>Duration:</strong> {spellEntry.duration || 'Unknown'}</div>
                                      </div>
                                      <p className="text-sm">{spellEntry.compendium_entry?.text || 'No description available.'}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newSpellIds = data.selected_spell_ids.filter(id => id !== spellId);
                                          setData('selected_spell_ids', newSpellIds);
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <p>No spells selected yet.</p>
                          </div>
                        )}

                        {/* Add New Spell Selector */}
                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-3">Add Spells from Compendium</h5>
                          <div className="space-y-4">
                            {/* Spell Search and Filter */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="spell_search">Search Spells</Label>
                                <Input
                                  id="spell_search"
                                  placeholder="Search spell names..."
                                  value={spellSearch}
                                  onChange={(e) => setSpellSearch(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="spell_level_filter">Filter by Level</Label>
                                <Select value={spellLevelFilter} onValueChange={setSpellLevelFilter}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="All levels" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All levels</SelectItem>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                                      <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="spell_school_filter">Filter by School</Label>
                                <Select value={spellSchoolFilter} onValueChange={setSpellSchoolFilter}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="All schools" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All schools</SelectItem>
                                    <SelectItem value="abjuration">Abjuration</SelectItem>
                                    <SelectItem value="conjuration">Conjuration</SelectItem>
                                    <SelectItem value="divination">Divination</SelectItem>
                                    <SelectItem value="enchantment">Enchantment</SelectItem>
                                    <SelectItem value="evocation">Evocation</SelectItem>
                                    <SelectItem value="illusion">Illusion</SelectItem>
                                    <SelectItem value="necromancy">Necromancy</SelectItem>
                                    <SelectItem value="transmutation">Transmutation</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Available Spells List */}
                            <div className="max-h-60 overflow-y-auto border rounded-lg">
                              {filteredSpells.length > 0 ? (
                                <div className="space-y-1 p-2">
                                  {filteredSpells.slice(0, 50).map((spell) => {
                                    const isSelected = data.selected_spell_ids.includes(spell.compendium_entry_id);
                                    return (
                                      <div
                                        key={spell.id}
                                        className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 ${
                                          isSelected ? 'bg-blue-50 border border-blue-200' : ''
                                        }`}
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2">
                                            <span className="font-medium">{spell.compendium_entry?.name}</span>
                                            <span className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                                              Level {spell.level}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                              {spell.school}
                                            </span>
                                            {spell.ritual && (
                                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                                Ritual
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <Button
                                          type="button"
                                          variant={isSelected ? "secondary" : "outline"}
                                          size="sm"
                                          onClick={() => {
                                            if (isSelected) {
                                              setData('selected_spell_ids', data.selected_spell_ids.filter(id => id !== spell.compendium_entry_id));
                                            } else {
                                              setData('selected_spell_ids', [...data.selected_spell_ids, spell.compendium_entry_id]);
                                            }
                                          }}
                                        >
                                          {isSelected ? 'Remove' : 'Add'}
                                        </Button>
                                      </div>
                                    );
                                  })}
                                  {filteredSpells.length > 50 && (
                                    <div className="text-center py-2 text-sm text-muted-foreground">
                                      Showing first 50 results. Use search to refine.
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No spells found matching your criteria.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="inventory">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Management</CardTitle>
                      <CardDescription>
                        Add items from the compendium to your character's inventory
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Selected Items Display */}
                        {data.selected_item_ids && data.selected_item_ids.length > 0 ? (
                          <div>
                            <h4 className="font-semibold mb-4">Current Inventory</h4>
                            <div className="space-y-3">
                              {data.selected_item_ids.map((itemId) => {
                                const itemEntry = compendiumData.items.find(i => i.compendium_entry_id === itemId);
                                if (!itemEntry) return null;

                                return (
                                  <div key={itemId} className="p-4 border rounded-lg">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <h4 className="font-medium">{itemEntry.compendium_entry?.name}</h4>
                                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {itemEntry.type || 'Item'}
                                          </span>
                                          {itemEntry.magic && (
                                            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                              Magic
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          {itemEntry.weight && (
                                            <div><strong>Weight:</strong> {itemEntry.weight} lbs</div>
                                          )}
                                          {itemEntry.value && (
                                            <div><strong>Value:</strong> {itemEntry.value} gp</div>
                                          )}
                                          {itemEntry.ac && (
                                            <div><strong>AC:</strong> {itemEntry.ac}</div>
                                          )}
                                        </div>
                                        {itemEntry.compendium_entry?.text && (
                                          <div className="mt-2 text-sm">
                                            <p className="line-clamp-3">{itemEntry.compendium_entry.text}</p>
                                          </div>
                                        )}
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newItemIds = data.selected_item_ids.filter(id => id !== itemId);
                                          setData('selected_item_ids', newItemIds);
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No items in inventory. Add items from the compendium below.</p>
                          </div>
                        )}

                        {/* Add Items Section */}
                        <div>
                          <h4 className="font-semibold mb-4">Add Items from Compendium</h4>
                          <div className="space-y-4">
                            {/* Search and Filter Controls */}
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
                                  <SelectItem value="W">Wondrous Item</SelectItem>
                                  <SelectItem value="P">Potion</SelectItem>
                                  <SelectItem value="RG">Ring</SelectItem>
                                  <SelectItem value="RD">Rod</SelectItem>
                                  <SelectItem value="ST">Staff</SelectItem>
                                  <SelectItem value="WD">Wand</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Items List */}
                            <div className="max-h-60 overflow-y-auto border rounded-lg">
                              {filteredItems.length > 0 ? (
                                <div className="space-y-1 p-2">
                                  {filteredItems.slice(0, 50).map((item) => {
                                    const isSelected = data.selected_item_ids.includes(item.compendium_entry_id);
                                    return (
                                      <div
                                        key={item.id}
                                        className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 ${
                                          isSelected ? 'bg-blue-50 border border-blue-200' : ''
                                        }`}
                                      >
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
                                        </div>
                                        <Button
                                          type="button"
                                          variant={isSelected ? "secondary" : "outline"}
                                          size="sm"
                                          onClick={() => {
                                            if (isSelected) {
                                              setData('selected_item_ids', data.selected_item_ids.filter(id => id !== item.compendium_entry_id));
                                            } else {
                                              setData('selected_item_ids', [...data.selected_item_ids, item.compendium_entry_id]);
                                            }
                                          }}
                                        >
                                          {isSelected ? 'Remove' : 'Add'}
                                        </Button>
                                      </div>
                                    );
                                  })}
                                  {filteredItems.length > 50 && (
                                    <div className="text-center py-2 text-sm text-muted-foreground">
                                      Showing first 50 results. Use search to refine.
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No items found matching your criteria.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="character">
                <Card>
                  <CardHeader>
                    <CardTitle>Character Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="personality_traits">Personality Traits</Label>
                      <Textarea
                        id="personality_traits"
                        value={data.personality_traits}
                        onChange={e => setData('personality_traits', e.target.value)}
                        placeholder="Describe your character's personality traits..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="ideals">Ideals</Label>
                      <Textarea
                        id="ideals"
                        value={data.ideals}
                        onChange={e => setData('ideals', e.target.value)}
                        placeholder="What drives your character? What are their core beliefs?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bonds">Bonds</Label>
                      <Textarea
                        id="bonds"
                        value={data.bonds}
                        onChange={e => setData('bonds', e.target.value)}
                        placeholder="What connects your character to the world?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="flaws">Flaws</Label>
                      <Textarea
                        id="flaws"
                        value={data.flaws}
                        onChange={e => setData('flaws', e.target.value)}
                        placeholder="What are your character's weaknesses or vices?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="backstory">Backstory</Label>
                      <Textarea
                        id="backstory"
                        value={data.backstory}
                        onChange={e => setData('backstory', e.target.value)}
                        placeholder="Tell your character's story..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8">
              <Link href={`/characters/${character.id}?tab=${getShowTab(activeTab)}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={processing}
                onClick={(e) => {
                  // Ensure form submission works even when focus is in tabs
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
