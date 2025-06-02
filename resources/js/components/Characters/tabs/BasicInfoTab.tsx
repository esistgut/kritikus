import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompendiumRace, CompendiumDndClass, CompendiumBackground } from '@/types';
import { CharacterFormData } from '../CharacterForm';
import { useBasicCompendiumData } from '@/hooks/useCompendiumHooks';

interface BasicInfoTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
  errors: any;
}

export default function BasicInfoTab({ data, setData, errors }: BasicInfoTabProps) {
  // Load compendium data dynamically
  const { data: races, loading: racesLoading } = useBasicCompendiumData<CompendiumRace>('/api/character-compendium/races');
  const { data: classes, loading: classesLoading } = useBasicCompendiumData<CompendiumDndClass>('/api/character-compendium/classes');
  const { data: backgrounds, loading: backgroundsLoading } = useBasicCompendiumData<CompendiumBackground>('/api/character-compendium/backgrounds');

  // Get available subclasses for the selected class
  const selectedClass = classes.find((cls: CompendiumDndClass) => cls.compendium_entry_id === data.class_id);
  const availableSubclasses = selectedClass?.subclasses || [];

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
              onValueChange={(value) => {
                setData('class_id', parseInt(value));
                // Reset subclass when class changes
                setData('subclass_id', null);
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classesLoading ? (
                  <SelectItem value="loading" disabled>Loading classes...</SelectItem>
                ) : (
                  classes.map((cls: CompendiumDndClass) => (
                    <SelectItem key={cls.id} value={cls.compendium_entry_id.toString()}>
                      {cls.compendium_entry?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.class_id && <p className="text-sm text-destructive mt-1">{errors.class_id}</p>}
          </div>
        </div>

        {/* Subclass selection - only show if class is selected and has subclasses */}
        {data.class_id && availableSubclasses.length > 0 && (
          <div>
            <Label htmlFor="subclass">Subclass</Label>
            <Select
              value={data.subclass_id ? data.subclass_id.toString() : 'none'}
              onValueChange={(value) => setData('subclass_id', value === 'none' ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subclass (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableSubclasses.map((subclass) => (
                  <SelectItem key={subclass.id} value={subclass.compendium_entry_id.toString()}>
                    {subclass.compendium_entry?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subclass_id && <p className="text-sm text-destructive mt-1">{errors.subclass_id}</p>}
          </div>
        )}

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
                {racesLoading ? (
                  <SelectItem value="loading" disabled>Loading races...</SelectItem>
                ) : (
                  races.map((race: CompendiumRace) => (
                    <SelectItem key={race.id} value={race.compendium_entry_id.toString()}>
                      {race.compendium_entry?.name}
                    </SelectItem>
                  ))
                )}
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
                {backgroundsLoading ? (
                  <SelectItem value="loading" disabled>Loading backgrounds...</SelectItem>
                ) : (
                  backgrounds.map((background: CompendiumBackground) => (
                    <SelectItem key={background.id} value={background.compendium_entry_id.toString()}>
                      {background.compendium_entry?.name}
                    </SelectItem>
                  ))
                )}
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
