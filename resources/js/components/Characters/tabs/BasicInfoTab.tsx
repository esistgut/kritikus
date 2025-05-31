import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompendiumData } from '@/types';
import { CharacterFormData } from '../CharacterForm';

interface BasicInfoTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
  errors: any;
  compendiumData: CompendiumData;
}

export default function BasicInfoTab({ data, setData, errors, compendiumData }: BasicInfoTabProps) {
  return (
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
              value={data.class_id ? data.class_id.toString() : ''}
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
              value={data.race_id ? data.race_id.toString() : ''}
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
              value={data.background_id ? data.background_id.toString() : ''}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
