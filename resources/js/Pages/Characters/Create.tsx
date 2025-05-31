import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { CompendiumData } from '@/types';

interface CharacterFormData {
  name: string;

  // Compendium references
  race_id: number;
  class_id: number;
  background_id: number;
  selected_spell_ids?: number[];
  selected_feat_ids?: number[];
  selected_item_ids?: number[];

  level: number;
  experience: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armor_class: number;
  initiative: number;
  speed: number;
  hit_point_maximum: number;
  current_hit_points: number;
  temporary_hit_points: number;
  hit_dice: number;
  hit_dice_total: number;
  strength_save_proficiency: boolean;
  dexterity_save_proficiency: boolean;
  constitution_save_proficiency: boolean;
  intelligence_save_proficiency: boolean;
  wisdom_save_proficiency: boolean;
  charisma_save_proficiency: boolean;
  skill_proficiencies: string[];
  skill_expertises: string[];
  languages: string[];
  armor_proficiencies: string[];
  weapon_proficiencies: string[];
  tool_proficiencies: string[];
  features_and_traits: any[];
  attacks_and_spells: any[];
  equipment: any[];
  personality_traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  spellcasting_class: string;
  spell_attack_bonus: number;
  spell_save_dc: number;
  spell_slots: any[];
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

export default function Create({ compendiumData }: { compendiumData: CompendiumData }) {
  const { data, setData, post, processing, errors } = useForm<CharacterFormData>({
    name: '',
    race_id: 0,
    class_id: 0,
    background_id: 0,
    selected_spell_ids: [],
    selected_feat_ids: [],
    selected_item_ids: [],
    level: 1,
    experience: 0,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    armor_class: 10,
    initiative: 0,
    speed: 30,
    hit_point_maximum: 8,
    current_hit_points: 8,
    temporary_hit_points: 0,
    hit_dice: 1,
    hit_dice_total: 1,
    strength_save_proficiency: false,
    dexterity_save_proficiency: false,
    constitution_save_proficiency: false,
    intelligence_save_proficiency: false,
    wisdom_save_proficiency: false,
    charisma_save_proficiency: false,
    skill_proficiencies: [],
    skill_expertises: [],
    languages: ['Common'],
    armor_proficiencies: [],
    weapon_proficiencies: [],
    tool_proficiencies: [],
    features_and_traits: [],
    attacks_and_spells: [],
    equipment: [],
    personality_traits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    backstory: '',
    spellcasting_class: '',
    spell_attack_bonus: 0,
    spell_save_dc: 8,
    spell_slots: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/characters');
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

  return (
    <AppLayout>
      <Head title="Create Character" />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/characters">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Characters
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Create New Character</h1>
              <p className="text-muted-foreground">Build your D&D 2024 character sheet</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="space-y-6">
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
                        <Select onValueChange={(value) => setData('class_id', parseInt(value))} required>
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
                        <Select onValueChange={(value) => setData('race_id', parseInt(value))} required>
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
                        <Select onValueChange={(value) => setData('background_id', parseInt(value))} required>
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
                            {ability} (Modifier: {getAbilityModifier(data[ability as keyof CharacterFormData] as number) >= 0 ? '+' : ''}{getAbilityModifier(data[ability as keyof CharacterFormData] as number)})
                          </Label>
                          <Input
                            id={ability}
                            type="number"
                            min="1"
                            max="30"
                            value={data[ability as keyof CharacterFormData] as number}
                            onChange={e => setData(ability as keyof CharacterFormData, parseInt(e.target.value) as any)}
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
                              checked={data[`${ability}_save_proficiency` as keyof CharacterFormData] as boolean}
                              onCheckedChange={(checked) =>
                                setData(`${ability}_save_proficiency` as keyof CharacterFormData, checked as any)
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
                <Card>
                  <CardHeader>
                    <CardTitle>Spellcasting</CardTitle>
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

                    <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                      <p className="font-medium mb-2">Note about Spell Management:</p>
                      <p>Spell slots and individual spells can be configured after character creation through the character edit page. This allows for more detailed spell management including spell preparation, slot tracking, and spell descriptions.</p>
                    </div>
                  </CardContent>
                </Card>
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
              <Link href="/characters">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                <Save className="h-4 w-4 mr-2" />
                {processing ? 'Creating...' : 'Create Character'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
