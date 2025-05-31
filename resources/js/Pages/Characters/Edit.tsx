import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    spells_known: character.spells_known,
  });

  // Map Edit tabs back to Show tabs
  const getShowTab = (editTab: string): string => {
    const tabMapping: { [key: string]: string } = {
      'basic': 'overview',
      'abilities': 'abilities',
      'combat': 'combat',
      'spells': 'spells',
      'skills': 'skills',
      'character': 'character'
    };
    return tabMapping[editTab] || 'overview';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get the tab parameter based on current active tab
    const tabToSend = getShowTab(activeTab);

    // Send the tab as a query parameter in the URL
    put(`/characters/${character.id}?tab=${tabToSend}`);
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

  // New spell form state
  const [newSpell, setNewSpell] = React.useState({
    name: '',
    level: 0,
    school: '',
    casting_time: '',
    range: '',
    components: '',
    duration: '',
    description: '',
    prepared: false
  });

  // Editing spells state
  const [editingSpellIndex, setEditingSpellIndex] = React.useState<number | null>(null);
  const [editingSpell, setEditingSpell] = React.useState({
    name: '',
    level: 0,
    school: '',
    casting_time: '',
    range: '',
    components: '',
    duration: '',
    description: '',
    prepared: false
  });

  const handleAddSpell = () => {
    if (newSpell.name.trim()) {
      const spellToAdd = {
        name: newSpell.name.trim(),
        level: newSpell.level,
        school: newSpell.school.trim() || 'Evocation',
        casting_time: newSpell.casting_time.trim() || '1 action',
        range: newSpell.range.trim() || 'Self',
        components: newSpell.components.trim() || 'V, S',
        duration: newSpell.duration.trim() || 'Instantaneous',
        description: newSpell.description.trim() || 'No description provided.',
        prepared: newSpell.prepared
      };

      setData('spells_known', [...(data.spells_known || []), spellToAdd]);

      // Reset form
      setNewSpell({
        name: '',
        level: 0,
        school: '',
        casting_time: '',
        range: '',
        components: '',
        duration: '',
        description: '',
        prepared: false
      });
    }
  };

  const handleEditSpell = (index: number) => {
    const spell = data.spells_known[index];
    setEditingSpellIndex(index);
    setEditingSpell({
      ...spell,
      prepared: spell.prepared || false
    });
  };

  const handleSaveSpellEdit = () => {
    if (editingSpellIndex !== null && editingSpell.name.trim()) {
      const newSpells = [...data.spells_known];
      newSpells[editingSpellIndex] = {
        name: editingSpell.name.trim(),
        level: editingSpell.level,
        school: editingSpell.school.trim() || 'Evocation',
        casting_time: editingSpell.casting_time.trim() || '1 action',
        range: editingSpell.range.trim() || 'Self',
        components: editingSpell.components.trim() || 'V, S',
        duration: editingSpell.duration.trim() || 'Instantaneous',
        description: editingSpell.description.trim() || 'No description provided.',
        prepared: editingSpell.prepared
      };

      setData('spells_known', newSpells);
      setEditingSpellIndex(null);
      setEditingSpell({
        name: '',
        level: 0,
        school: '',
        casting_time: '',
        range: '',
        components: '',
        duration: '',
        description: '',
        prepared: false
      });
    }
  };

  const handleCancelSpellEdit = () => {
    setEditingSpellIndex(null);
    setEditingSpell({
      name: '',
      level: 0,
      school: '',
      casting_time: '',
      range: '',
      components: '',
      duration: '',
      description: '',
      prepared: false
    });
  };

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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="abilities">Abilities</TabsTrigger>
                <TabsTrigger value="combat">Combat</TabsTrigger>
                <TabsTrigger value="spells">Spells</TabsTrigger>
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
                        {data.spells_known && data.spells_known.length > 0 ? (
                          <div className="space-y-3">
                            {data.spells_known.map((spell, index) => (
                              <div key={index} className="p-4 border rounded-lg">
                                {editingSpellIndex === index ? (
                                  // Editing mode
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor={`edit_spell_name_${index}`}>Spell Name</Label>
                                        <Input
                                          id={`edit_spell_name_${index}`}
                                          value={editingSpell.name}
                                          onChange={(e) => setEditingSpell({...editingSpell, name: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`edit_spell_level_${index}`}>Level</Label>
                                        <Input
                                          id={`edit_spell_level_${index}`}
                                          type="number"
                                          min="0"
                                          max="9"
                                          value={editingSpell.level}
                                          onChange={(e) => setEditingSpell({...editingSpell, level: parseInt(e.target.value) || 0})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`edit_spell_school_${index}`}>School</Label>
                                        <Input
                                          id={`edit_spell_school_${index}`}
                                          value={editingSpell.school}
                                          onChange={(e) => setEditingSpell({...editingSpell, school: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`edit_spell_casting_time_${index}`}>Casting Time</Label>
                                        <Input
                                          id={`edit_spell_casting_time_${index}`}
                                          value={editingSpell.casting_time}
                                          onChange={(e) => setEditingSpell({...editingSpell, casting_time: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`edit_spell_range_${index}`}>Range</Label>
                                        <Input
                                          id={`edit_spell_range_${index}`}
                                          value={editingSpell.range}
                                          onChange={(e) => setEditingSpell({...editingSpell, range: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`edit_spell_components_${index}`}>Components</Label>
                                        <Input
                                          id={`edit_spell_components_${index}`}
                                          value={editingSpell.components}
                                          onChange={(e) => setEditingSpell({...editingSpell, components: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`edit_spell_duration_${index}`}>Duration</Label>
                                        <Input
                                          id={`edit_spell_duration_${index}`}
                                          value={editingSpell.duration}
                                          onChange={(e) => setEditingSpell({...editingSpell, duration: e.target.value})}
                                        />
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`edit_spell_prepared_${index}`}
                                          checked={editingSpell.prepared}
                                          onCheckedChange={(checked) => setEditingSpell({...editingSpell, prepared: checked as boolean})}
                                        />
                                        <Label htmlFor={`edit_spell_prepared_${index}`}>Prepared</Label>
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor={`edit_spell_description_${index}`}>Description</Label>
                                      <Textarea
                                        id={`edit_spell_description_${index}`}
                                        value={editingSpell.description}
                                        onChange={(e) => setEditingSpell({...editingSpell, description: e.target.value})}
                                      />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancelSpellEdit}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleSaveSpellEdit}
                                      >
                                        Save Changes
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  // Display mode
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-medium">{spell.name}</h4>
                                        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                          Level {spell.level}
                                        </span>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                          {spell.school}
                                        </span>
                                        {spell.prepared && (
                                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                            Prepared
                                          </span>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-2">
                                        <div><strong>Casting Time:</strong> {spell.casting_time}</div>
                                        <div><strong>Range:</strong> {spell.range}</div>
                                        <div><strong>Components:</strong> {spell.components}</div>
                                        <div><strong>Duration:</strong> {spell.duration}</div>
                                      </div>
                                      <p className="text-sm">{spell.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                      <Checkbox
                                        checked={spell.prepared || false}
                                        onCheckedChange={(checked) => {
                                          const newSpells = [...data.spells_known];
                                          newSpells[index].prepared = checked as boolean;
                                          setData('spells_known', newSpells);
                                        }}
                                      />
                                      <Label className="text-sm">Prepared</Label>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditSpell(index)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newSpells = data.spells_known.filter((_, i) => i !== index);
                                          setData('spells_known', newSpells);
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <p>No spells known yet.</p>
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-3">Add New Spell</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new_spell_name">Spell Name</Label>
                              <Input
                                id="new_spell_name"
                                placeholder="Enter spell name"
                                value={newSpell.name}
                                onChange={(e) => setNewSpell({...newSpell, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new_spell_level">Level</Label>
                              <Input
                                id="new_spell_level"
                                type="number"
                                min="0"
                                max="9"
                                placeholder="0-9"
                                value={newSpell.level}
                                onChange={(e) => setNewSpell({...newSpell, level: parseInt(e.target.value) || 0})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new_spell_school">School</Label>
                              <Input
                                id="new_spell_school"
                                placeholder="e.g., Evocation"
                                value={newSpell.school}
                                onChange={(e) => setNewSpell({...newSpell, school: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new_spell_casting_time">Casting Time</Label>
                              <Input
                                id="new_spell_casting_time"
                                placeholder="e.g., 1 action"
                                value={newSpell.casting_time}
                                onChange={(e) => setNewSpell({...newSpell, casting_time: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new_spell_range">Range</Label>
                              <Input
                                id="new_spell_range"
                                placeholder="e.g., 120 feet"
                                value={newSpell.range}
                                onChange={(e) => setNewSpell({...newSpell, range: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new_spell_components">Components</Label>
                              <Input
                                id="new_spell_components"
                                placeholder="e.g., V, S, M"
                                value={newSpell.components}
                                onChange={(e) => setNewSpell({...newSpell, components: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new_spell_duration">Duration</Label>
                              <Input
                                id="new_spell_duration"
                                placeholder="e.g., Instantaneous"
                                value={newSpell.duration}
                                onChange={(e) => setNewSpell({...newSpell, duration: e.target.value})}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="new_spell_prepared"
                                checked={newSpell.prepared}
                                onCheckedChange={(checked) => setNewSpell({...newSpell, prepared: checked as boolean})}
                              />
                              <Label htmlFor="new_spell_prepared">Prepared</Label>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label htmlFor="new_spell_description">Description</Label>
                            <Textarea
                              id="new_spell_description"
                              placeholder="Enter spell description..."
                              value={newSpell.description}
                              onChange={(e) => setNewSpell({...newSpell, description: e.target.value})}
                            />
                          </div>
                          <Button
                            type="button"
                            className="mt-4"
                            onClick={handleAddSpell}
                            disabled={!newSpell.name.trim()}
                          >
                            Add Spell
                          </Button>
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
              <Button type="submit" disabled={processing}>
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
