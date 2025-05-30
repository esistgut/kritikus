import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Character } from '@/types';
import { ArrowLeft, Edit, Trash2, Heart, Shield, Sparkles, Zap } from 'lucide-react';
import { router } from '@inertiajs/react';

interface CharacterShowProps extends PageProps {
  character: Character;
}

export default function Show({ character }: CharacterShowProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${character.name}? This action cannot be undone.`)) {
      router.delete(`/characters/${character.id}`);
    }
  };

  const getAbilityModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getSavingThrowModifier = (ability: string, score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    const proficient = character[`${ability}_save_proficiency` as keyof Character] as boolean;
    const proficiencyBonus = Math.ceil(character.level / 4) + 1;
    const total = modifier + (proficient ? proficiencyBonus : 0);
    return total >= 0 ? `+${total}` : `${total}`;
  };

  const getSkillModifier = (skill: string, abilityScore: number): string => {
    const modifier = Math.floor((abilityScore - 10) / 2);
    const proficient = character.skill_proficiencies.includes(skill);
    const expert = character.skill_expertises.includes(skill);
    const proficiencyBonus = Math.ceil(character.level / 4) + 1;

    let total = modifier;
    if (expert) {
      total += proficiencyBonus * 2;
    } else if (proficient) {
      total += proficiencyBonus;
    }

    return total >= 0 ? `+${total}` : `${total}`;
  };

  const skillAbilityMap: { [key: string]: number } = {
    'Acrobatics': character.dexterity,
    'Animal Handling': character.wisdom,
    'Arcana': character.intelligence,
    'Athletics': character.strength,
    'Deception': character.charisma,
    'History': character.intelligence,
    'Insight': character.wisdom,
    'Intimidation': character.charisma,
    'Investigation': character.intelligence,
    'Medicine': character.wisdom,
    'Nature': character.intelligence,
    'Perception': character.wisdom,
    'Performance': character.charisma,
    'Persuasion': character.charisma,
    'Religion': character.intelligence,
    'Sleight of Hand': character.dexterity,
    'Stealth': character.dexterity,
    'Survival': character.wisdom,
  };

  return (
    <AppLayout>
      <Head title={`${character.name} - Character Sheet`} />

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/characters">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Characters
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{character.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{character.race}</Badge>
                  <Badge variant="outline">{character.class}</Badge>
                  <Badge variant="default">Level {character.level}</Badge>
                  <Badge variant="outline">{character.background}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/characters/${character.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="combat">Combat</TabsTrigger>
              <TabsTrigger value="spells">Spells</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="character">Character</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Core Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Combat Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Armor Class:</span>
                      <span className="text-lg font-bold">{character.armor_class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Initiative:</span>
                      <span className="text-lg font-bold">{character.initiative >= 0 ? '+' : ''}{character.initiative}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Speed:</span>
                      <span className="text-lg font-bold">{character.speed} ft</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Hit Points */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-500" />
                      Hit Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Current:</span>
                      <span className="text-lg font-bold text-red-600">{character.current_hit_points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Maximum:</span>
                      <span className="text-lg font-bold">{character.hit_point_maximum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Temporary:</span>
                      <span className="text-lg font-bold text-blue-600">{character.temporary_hit_points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Hit Dice:</span>
                      <span className="text-lg font-bold">{character.hit_dice}/{character.hit_dice_total}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Level:</span>
                      <span className="text-lg font-bold">{character.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Experience:</span>
                      <span className="text-lg font-bold">{character.experience.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Spellcasting (if character has spellcasting) */}
                {character.spellcasting_class && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                        Spellcasting
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Class:</span>
                        <span className="text-lg font-bold">{character.spellcasting_class}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Spell Attack:</span>
                        <span className="text-lg font-bold">{character.spell_attack_bonus >= 0 ? '+' : ''}{character.spell_attack_bonus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Spell Save DC:</span>
                        <span className="text-lg font-bold">{character.spell_save_dc}</span>
                      </div>
                      {character.spell_slots.length > 0 && (
                        <div>
                          <span className="font-medium">Spell Slots:</span>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {character.spell_slots.map((slot) => (
                              <Badge key={slot.level} variant="outline" className="text-sm">
                                Level {slot.level}: {slot.total - slot.used}/{slot.total}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="abilities">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ability Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ability Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: 'Strength', value: character.strength, key: 'strength' },
                        { name: 'Dexterity', value: character.dexterity, key: 'dexterity' },
                        { name: 'Constitution', value: character.constitution, key: 'constitution' },
                        { name: 'Intelligence', value: character.intelligence, key: 'intelligence' },
                        { name: 'Wisdom', value: character.wisdom, key: 'wisdom' },
                        { name: 'Charisma', value: character.charisma, key: 'charisma' },
                      ].map((ability) => (
                        <div key={ability.key} className="text-center p-3 border rounded-lg">
                          <div className="font-semibold text-sm">{ability.name}</div>
                          <div className="text-2xl font-bold">{ability.value}</div>
                          <div className="text-sm text-muted-foreground">
                            {getAbilityModifier(ability.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Saving Throws */}
                <Card>
                  <CardHeader>
                    <CardTitle>Saving Throws</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'Strength', value: character.strength, key: 'strength' },
                        { name: 'Dexterity', value: character.dexterity, key: 'dexterity' },
                        { name: 'Constitution', value: character.constitution, key: 'constitution' },
                        { name: 'Intelligence', value: character.intelligence, key: 'intelligence' },
                        { name: 'Wisdom', value: character.wisdom, key: 'wisdom' },
                        { name: 'Charisma', value: character.charisma, key: 'charisma' },
                      ].map((ability) => {
                        const proficient = character[`${ability.key}_save_proficiency` as keyof Character] as boolean;
                        return (
                          <div key={ability.key} className="flex justify-between items-center py-1">
                            <span className={`${proficient ? 'font-semibold' : ''}`}>
                              {proficient && '● '}{ability.name}
                            </span>
                            <span className="font-mono">
                              {getSavingThrowModifier(ability.key, ability.value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(skillAbilityMap).map(([skill, abilityScore]) => {
                        const proficient = character.skill_proficiencies.includes(skill);
                        const expert = character.skill_expertises.includes(skill);
                        return (
                          <div key={skill} className="flex justify-between items-center py-1">
                            <span className={`${proficient || expert ? 'font-semibold' : ''}`}>
                              {expert && '◆ '}{proficient && !expert && '● '}{skill}
                            </span>
                            <span className="font-mono">
                              {getSkillModifier(skill, abilityScore)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Languages & Proficiencies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {character.languages.map((language) => (
                          <Badge key={language} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    </div>

                    {character.weapon_proficiencies.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Weapon Proficiencies</h4>
                        <div className="flex flex-wrap gap-1">
                          {character.weapon_proficiencies.map((weapon) => (
                            <Badge key={weapon} variant="outline">{weapon}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {character.armor_proficiencies.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Armor Proficiencies</h4>
                        <div className="flex flex-wrap gap-1">
                          {character.armor_proficiencies.map((armor) => (
                            <Badge key={armor} variant="outline">{armor}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {character.tool_proficiencies.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Tool Proficiencies</h4>
                        <div className="flex flex-wrap gap-1">
                          {character.tool_proficiencies.map((tool) => (
                            <Badge key={tool} variant="outline">{tool}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="spells">
              {character.spellcasting_class ? (
                <div className="space-y-6">
                  {/* Spellcasting Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                        Spellcasting Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-semibold text-sm">Spellcasting Class</div>
                        <div className="text-lg font-bold">{character.spellcasting_class}</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-semibold text-sm">Spell Attack Bonus</div>
                        <div className="text-lg font-bold">{character.spell_attack_bonus >= 0 ? '+' : ''}{character.spell_attack_bonus}</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-semibold text-sm">Spell Save DC</div>
                        <div className="text-lg font-bold">{character.spell_save_dc}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spell Slots */}
                  {character.spell_slots.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Spell Slots</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {character.spell_slots.map((slot) => (
                            <div key={slot.level} className="text-center p-4 border rounded-lg">
                              <div className="font-semibold text-sm">Level {slot.level}</div>
                              <div className="text-2xl font-bold mt-2">
                                <span className="text-blue-600">{slot.total - slot.used}</span>
                                <span className="text-muted-foreground">/{slot.total}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {slot.used} used
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${((slot.total - slot.used) / slot.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Known Spells */}
                  {character.spells_known.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Known Spells ({character.spells_known.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Array.from(new Set(character.spells_known.map(spell => spell.level))).sort((a, b) => a - b).map(level => (
                            <div key={level}>
                              <h4 className="font-semibold mb-3">
                                {level === 0 ? 'Cantrips' : `Level ${level} Spells`}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {character.spells_known
                                  .filter(spell => spell.level === level)
                                  .map((spell, index) => (
                                    <Card key={index} className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-semibold">{spell.name}</h5>
                                        <div className="flex gap-1">
                                          <Badge variant="secondary" className="text-xs">
                                            {spell.school}
                                          </Badge>
                                          {spell.prepared && (
                                            <Badge variant="default" className="text-xs">
                                              Prepared
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-sm text-muted-foreground space-y-1">
                                        <div><strong>Casting Time:</strong> {spell.casting_time}</div>
                                        <div><strong>Range:</strong> {spell.range}</div>
                                        <div><strong>Components:</strong> {spell.components}</div>
                                        <div><strong>Duration:</strong> {spell.duration}</div>
                                      </div>
                                      <div className="mt-3 text-sm">
                                        <strong>Description:</strong> {spell.description}
                                      </div>
                                    </Card>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {character.spells_known.length === 0 && character.spell_slots.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-2">No Spells Configured</h3>
                        <p className="text-muted-foreground">
                          This character is a {character.spellcasting_class} but has no spell slots or known spells configured yet.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">No Spellcasting</h3>
                    <p className="text-muted-foreground">
                      This character does not have spellcasting abilities.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="character">
              <div className="space-y-6">
                {character.personality_traits && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Personality Traits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{character.personality_traits}</p>
                    </CardContent>
                  </Card>
                )}

                {character.ideals && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ideals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{character.ideals}</p>
                    </CardContent>
                  </Card>
                )}

                {character.bonds && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Bonds</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{character.bonds}</p>
                    </CardContent>
                  </Card>
                )}

                {character.flaws && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Flaws</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{character.flaws}</p>
                    </CardContent>
                  </Card>
                )}

                {character.backstory && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Backstory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{character.backstory}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
