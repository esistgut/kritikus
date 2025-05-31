import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, Save } from 'lucide-react';
import { Character, CompendiumData, PageProps } from '@/types';

import BasicInfoTab from './tabs/BasicInfoTab';
import AbilitiesTab from './tabs/AbilitiesTab';
import CombatTab from './tabs/CombatTab';
import SpellsTab from './tabs/SpellsTab';
import InventoryTab from './tabs/InventoryTab';
import SkillsTab from './tabs/SkillsTab';
import CharacterDetailsTab from './tabs/CharacterDetailsTab';

export interface CharacterFormData {
  name: string;
  race_id: number;
  class_id: number;
  background_id: number;
  selected_spell_ids: number[];
  selected_feat_ids: number[];
  selected_item_ids: number[];
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

interface CharacterFormProps extends PageProps {
  character?: Character;
  compendiumData: CompendiumData;
  mode: 'create' | 'edit';
}

const getDefaultFormData = (): CharacterFormData => ({
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

const getFormDataFromCharacter = (character: Character): CharacterFormData => ({
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

export default function CharacterForm({ character, compendiumData, mode }: CharacterFormProps) {
  // Get the tab parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'basic';

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const initialData = mode === 'edit' && character
    ? getFormDataFromCharacter(character)
    : getDefaultFormData();

  const { data, setData, post, put, processing, errors } = useForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      post('/characters');
    } else if (character) {
      put(`/characters/${character.id}`);
    }
  };

  // Map Edit tabs back to Show tabs for cancel button
  const getShowTab = (editTab: string): string => {
    const tabMapping: { [key: string]: string } = {
      'basic': 'overview',
      'abilities': 'abilities',
      'combat': 'combat',
      'spells': 'spells',
      'inventory': 'inventory',
      'skills': 'skills',
      'character': 'character',
    };
    return tabMapping[editTab] || 'overview';
  };

  return (
    <AppLayout>
      <Head title={mode === 'create' ? 'Create Character' : `Edit ${character?.name}`} />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href={mode === 'create' ? '/characters' : `/characters/${character?.id}?tab=${getShowTab(activeTab)}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Back to Characters' : 'Back to Character'}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {mode === 'create' ? 'Create New Character' : `Edit ${character?.name}`}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'create' ? 'Build your D&D 2024 character sheet' : 'Update your D&D 2024 character sheet'}
              </p>
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
                <BasicInfoTab
                  data={data}
                  setData={setData}
                  errors={errors}
                  compendiumData={compendiumData}
                />
              </TabsContent>

              <TabsContent value="abilities">
                <AbilitiesTab
                  data={data}
                  setData={setData}
                />
              </TabsContent>

              <TabsContent value="combat">
                <CombatTab
                  data={data}
                  setData={setData}
                />
              </TabsContent>

              <TabsContent value="spells">
                <SpellsTab
                  data={data}
                  setData={setData}
                  compendiumData={compendiumData}
                />
              </TabsContent>

              <TabsContent value="inventory">
                <InventoryTab
                  data={data}
                  setData={setData}
                  compendiumData={compendiumData}
                />
              </TabsContent>

              <TabsContent value="skills">
                <SkillsTab
                  data={data}
                  setData={setData}
                />
              </TabsContent>

              <TabsContent value="character">
                <CharacterDetailsTab
                  data={data}
                  setData={setData}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8">
              <Link href={mode === 'create' ? '/characters' : `/characters/${character?.id}?tab=${getShowTab(activeTab)}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                <Save className="h-4 w-4 mr-2" />
                {processing
                  ? (mode === 'create' ? 'Creating...' : 'Saving...')
                  : (mode === 'create' ? 'Create Character' : 'Save Changes')
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
