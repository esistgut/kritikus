import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CharacterFormData } from '../CharacterForm';

interface CharacterDetailsTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
}

export default function CharacterDetailsTab({ data, setData }: CharacterDetailsTabProps) {
  return (
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
  );
}
