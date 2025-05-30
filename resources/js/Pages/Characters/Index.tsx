import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { Character, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Heart, Plus, Shield, Swords, Trash2 } from 'lucide-react';

interface CharactersIndexProps extends PageProps {
  characters: Character[];
}

export default function Index({ characters }: CharactersIndexProps) {
  const handleDelete = (character: Character) => {
    if (confirm(`Are you sure you want to delete ${character.name}? This action cannot be undone.`)) {
      router.delete(`/characters/${character.id}`);
    }
  };

  const getAbilityModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <AppLayout>
      <Head title="Character Manager" />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Character Manager</h1>
              <p className="text-muted-foreground mt-2">
                Manage your D&D 2024 character sheets
              </p>
            </div>
            <Link href="/characters/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Character
              </Button>
            </Link>
          </div>

          {characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <Card key={character.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary">{character.race}</Badge>
                          <Badge variant="outline">{character.class}</Badge>
                          <Badge variant="default">Level {character.level}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Core Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span>AC {character.armor_class}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{character.current_hit_points}/{character.hit_point_maximum}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Swords className="h-4 w-4 text-green-500" />
                          <span>Speed {character.speed}</span>
                        </div>
                      </div>

                      {/* Ability Scores */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold">STR</div>
                          <div>{character.strength} ({getAbilityModifier(character.strength)})</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">DEX</div>
                          <div>{character.dexterity} ({getAbilityModifier(character.dexterity)})</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">CON</div>
                          <div>{character.constitution} ({getAbilityModifier(character.constitution)})</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">INT</div>
                          <div>{character.intelligence} ({getAbilityModifier(character.intelligence)})</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">WIS</div>
                          <div>{character.wisdom} ({getAbilityModifier(character.wisdom)})</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">CHA</div>
                          <div>{character.charisma} ({getAbilityModifier(character.charisma)})</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between pt-4 border-t">
                        <div className="flex gap-2">
                          <Link href={`/characters/${character.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/characters/${character.id}/edit`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(character)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">No Characters Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first D&D character to get started with your adventure!
                  </p>
                  <Link href="/characters/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Character
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
