import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CharacterFormData } from '../CharacterForm';

interface AbilitiesTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
}

const getAbilityModifier = (score: number): string => {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export default function AbilitiesTab({ data, setData }: AbilitiesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ability Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map((ability) => (
            <div key={ability} className="space-y-2">
              <Label htmlFor={ability} className="capitalize">
                {ability} (Modifier: {getAbilityModifier(data[ability])})
              </Label>
              <Input
                id={ability}
                type="number"
                min="1"
                max="30"
                value={data[ability]}
                onChange={e => setData(ability, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-3">Saving Throw Proficiencies</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map((ability) => (
              <div key={ability} className="flex items-center space-x-2">
                <Checkbox
                  id={`${ability}_save`}
                  checked={data[`${ability}_save_proficiency` as keyof CharacterFormData] as boolean}
                  onCheckedChange={(checked) =>
                    setData(`${ability}_save_proficiency` as keyof CharacterFormData, checked)
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
  );
}
