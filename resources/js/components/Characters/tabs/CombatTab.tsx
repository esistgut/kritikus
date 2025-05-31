import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CharacterFormData } from '../CharacterForm';

interface CombatTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
}

export default function CombatTab({ data, setData }: CombatTabProps) {
  return (
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
  );
}
