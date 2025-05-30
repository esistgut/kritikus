<?php

namespace Database\Seeders;

use App\Models\Character;
use Illuminate\Database\Seeder;

class CharacterSeeder extends Seeder
{
    public function run()
    {
        Character::create([
            'name' => 'Thorin Ironforge',
            'class' => 'Fighter',
            'race' => 'Mountain Dwarf',
            'background' => 'Soldier',
            'level' => 5,
            'experience' => 6500,
            'strength' => 16,
            'dexterity' => 13,
            'constitution' => 15,
            'intelligence' => 10,
            'wisdom' => 12,
            'charisma' => 8,
            'armor_class' => 18,
            'initiative' => 1,
            'speed' => 25,
            'hit_point_maximum' => 47,
            'current_hit_points' => 47,
            'temporary_hit_points' => 0,
            'hit_dice' => 5,
            'hit_dice_total' => 5,
            'strength_save_proficiency' => true,
            'dexterity_save_proficiency' => false,
            'constitution_save_proficiency' => true,
            'intelligence_save_proficiency' => false,
            'wisdom_save_proficiency' => false,
            'charisma_save_proficiency' => false,
            'skill_proficiencies' => ['Athletics', 'Intimidation', 'Perception', 'Survival'],
            'skill_expertises' => [],
            'languages' => ['Common', 'Dwarvish'],
            'armor_proficiencies' => ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'],
            'weapon_proficiencies' => ['Simple Weapons', 'Martial Weapons'],
            'tool_proficiencies' => ["Smith's Tools", 'Vehicles (Land)'],
            'features_and_traits' => [
                [
                    'name' => 'Fighting Style: Defense',
                    'description' => 'While wearing armor, you gain a +1 bonus to AC.',
                    'source' => 'Fighter'
                ],
                [
                    'name' => 'Second Wind',
                    'description' => 'You have a limited well of stamina that you can draw on to protect yourself from harm.',
                    'source' => 'Fighter'
                ],
                [
                    'name' => 'Action Surge',
                    'description' => 'You can push yourself beyond your normal limits for a moment.',
                    'source' => 'Fighter'
                ],
                [
                    'name' => 'Darkvision',
                    'description' => 'You can see in dim light within 60 feet of you as if it were bright light.',
                    'source' => 'Mountain Dwarf'
                ]
            ],
            'attacks_and_spells' => [
                [
                    'name' => 'Longsword',
                    'attack_bonus' => 8,
                    'damage' => '1d8+3',
                    'damage_type' => 'slashing',
                    'range' => '5 ft',
                    'description' => 'Versatile (1d10)'
                ],
                [
                    'name' => 'Handaxe',
                    'attack_bonus' => 8,
                    'damage' => '1d6+3',
                    'damage_type' => 'slashing',
                    'range' => '20/60 ft',
                    'description' => 'Light, thrown'
                ]
            ],
            'equipment' => [
                ['name' => 'Chain Mail', 'quantity' => 1, 'weight' => 55, 'value' => '75 gp'],
                ['name' => 'Longsword', 'quantity' => 1, 'weight' => 3, 'value' => '15 gp'],
                ['name' => 'Handaxe', 'quantity' => 2, 'weight' => 2, 'value' => '5 gp'],
                ['name' => 'Shield', 'quantity' => 1, 'weight' => 6, 'value' => '10 gp'],
                ['name' => 'Explorer\'s Pack', 'quantity' => 1, 'weight' => 59, 'value' => '10 gp'],
                ['name' => 'Gold Pieces', 'quantity' => 150, 'weight' => 0, 'value' => '150 gp']
            ],
            'personality_traits' => 'I can stare down a hell hound without flinching. I enjoy being strong and like breaking things.',
            'ideals' => 'Responsibility. I do what I must and obey just authority.',
            'bonds' => 'Those who fight beside me are those worth dying for.',
            'flaws' => 'I made a terrible mistake in battle that cost many lives—and I would do anything to keep that mistake secret.',
            'backstory' => 'Thorin served as a soldier in the mountain kingdom\'s army for over a decade. He fought in numerous battles against orc raiders and goblin incursions. His experience in warfare has made him a skilled tactician and a formidable warrior.',
            'spellcasting_class' => null,
            'spell_attack_bonus' => 0,
            'spell_save_dc' => 8,
            'spell_slots' => [],
            'spells_known' => []
        ]);

        Character::create([
            'name' => 'Lyralei Moonwhisper',
            'class' => 'Wizard',
            'race' => 'High Elf',
            'background' => 'Sage',
            'level' => 3,
            'experience' => 900,
            'strength' => 8,
            'dexterity' => 14,
            'constitution' => 13,
            'intelligence' => 16,
            'wisdom' => 12,
            'charisma' => 11,
            'armor_class' => 12,
            'initiative' => 2,
            'speed' => 30,
            'hit_point_maximum' => 16,
            'current_hit_points' => 16,
            'temporary_hit_points' => 0,
            'hit_dice' => 3,
            'hit_dice_total' => 3,
            'strength_save_proficiency' => false,
            'dexterity_save_proficiency' => false,
            'constitution_save_proficiency' => false,
            'intelligence_save_proficiency' => true,
            'wisdom_save_proficiency' => true,
            'charisma_save_proficiency' => false,
            'skill_proficiencies' => ['Arcana', 'History', 'Investigation', 'Medicine'],
            'skill_expertises' => [],
            'languages' => ['Common', 'Elvish', 'Draconic', 'Celestial'],
            'armor_proficiencies' => [],
            'weapon_proficiencies' => ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows'],
            'tool_proficiencies' => ['Alchemist\'s Supplies'],
            'features_and_traits' => [
                [
                    'name' => 'Spellcasting',
                    'description' => 'You are a spellcaster. Your spellcasting ability is Intelligence.',
                    'source' => 'Wizard'
                ],
                [
                    'name' => 'Arcane Recovery',
                    'description' => 'You can regain some of your magical energy by studying your spellbook.',
                    'source' => 'Wizard'
                ],
                [
                    'name' => 'Darkvision',
                    'description' => 'You can see in dim light within 60 feet as if it were bright light.',
                    'source' => 'High Elf'
                ],
                [
                    'name' => 'Fey Ancestry',
                    'description' => 'You have advantage on saving throws against being charmed.',
                    'source' => 'High Elf'
                ]
            ],
            'attacks_and_spells' => [
                [
                    'name' => 'Dagger',
                    'attack_bonus' => 4,
                    'damage' => '1d4+2',
                    'damage_type' => 'piercing',
                    'range' => '20/60 ft',
                    'description' => 'Finesse, light, thrown'
                ]
            ],
            'equipment' => [
                ['name' => 'Spellbook', 'quantity' => 1, 'weight' => 3, 'value' => '50 gp'],
                ['name' => 'Dagger', 'quantity' => 2, 'weight' => 1, 'value' => '2 gp'],
                ['name' => 'Component Pouch', 'quantity' => 1, 'weight' => 2, 'value' => '25 gp'],
                ['name' => 'Scholar\'s Pack', 'quantity' => 1, 'weight' => 40, 'value' => '40 gp'],
                ['name' => 'Ink and Quill', 'quantity' => 1, 'weight' => 0, 'value' => '2 gp'],
                ['name' => 'Gold Pieces', 'quantity' => 85, 'weight' => 0, 'value' => '85 gp']
            ],
            'personality_traits' => 'I am horribly, horribly awkward in social situations. I speak without really thinking through my words, invariably insulting others.',
            'ideals' => 'Knowledge. The path to power and self-improvement is through knowledge.',
            'bonds' => 'The workshop where I learned my trade is the most important place in the world to me.',
            'flaws' => 'I speak without really thinking through my words, invariably insulting others.',
            'backstory' => 'Lyralei spent years studying ancient magical texts in the great library of her homeland. Her thirst for arcane knowledge led her to become a powerful wizard, though her social skills suffered from years of isolation among dusty tomes.',
            'spellcasting_class' => 'Wizard',
            'spell_attack_bonus' => 5,
            'spell_save_dc' => 13,
            'spell_slots' => [
                ['level' => 1, 'total' => 4, 'used' => 0],
                ['level' => 2, 'total' => 2, 'used' => 0]
            ],
            'spells_known' => [
                [
                    'name' => 'Magic Missile',
                    'level' => 1,
                    'school' => 'Evocation',
                    'casting_time' => '1 action',
                    'range' => '120 feet',
                    'components' => 'V, S',
                    'duration' => 'Instantaneous',
                    'description' => 'Three darts of magical force hit their targets.',
                    'prepared' => true
                ],
                [
                    'name' => 'Shield',
                    'level' => 1,
                    'school' => 'Abjuration',
                    'casting_time' => '1 reaction',
                    'range' => 'Self',
                    'components' => 'V, S',
                    'duration' => '1 round',
                    'description' => 'An invisible barrier of magical force appears and protects you.',
                    'prepared' => true
                ],
                [
                    'name' => 'Detect Magic',
                    'level' => 1,
                    'school' => 'Divination',
                    'casting_time' => '1 action',
                    'range' => 'Self',
                    'components' => 'V, S',
                    'duration' => 'Concentration, up to 10 minutes',
                    'description' => 'You sense the presence of magic within 30 feet of you.',
                    'prepared' => true
                ]
            ]
        ]);
    }
}
