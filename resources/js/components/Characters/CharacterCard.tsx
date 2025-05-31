import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Edit, Eye, Heart, Shield, Sparkles, Swords, Trash2 } from 'lucide-react';
import { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
  onDelete: (character: Character) => void;
}

const getAbilityModifier = (score: number): string => {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export default function CharacterCard({ character, onDelete }: CharacterCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{character.name}</CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary">{character.race?.name || 'Unknown Race'}</Badge>
              <Badge variant="outline">{character.character_class?.name || 'Unknown Class'}</Badge>
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

          {/* Spell Slots (if character has spellcasting) */}
          {character.spellcasting_class && character.spell_slots.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>{character.spellcasting_class} Spells</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {character.spell_slots.map((slot) => (
                  <Badge key={slot.level} variant="outline" className="text-xs">
                    L{slot.level}: {slot.total - slot.used}/{slot.total}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
              onClick={() => onDelete(character)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
