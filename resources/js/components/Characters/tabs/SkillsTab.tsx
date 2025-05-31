import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CharacterFormData } from '../CharacterForm';

interface SkillsTabProps {
  data: CharacterFormData;
  setData: (key: keyof CharacterFormData, value: any) => void;
}

const SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'
];

const LANGUAGES = [
  'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

export default function SkillsTab({ data, setData }: SkillsTabProps) {
  const handleSkillProficiencyChange = (skill: string, checked: boolean) => {
    if (checked) {
      setData('skill_proficiencies', [...data.skill_proficiencies, skill]);
    } else {
      setData('skill_proficiencies', data.skill_proficiencies.filter(s => s !== skill));
      // Also remove from expertise if it was there
      setData('skill_expertises', data.skill_expertises.filter(s => s !== skill));
    }
  };

  const handleSkillExpertiseChange = (skill: string, checked: boolean) => {
    if (checked) {
      setData('skill_expertises', [...data.skill_expertises, skill]);
      // Also add to proficiencies if not already there
      if (!data.skill_proficiencies.includes(skill)) {
        setData('skill_proficiencies', [...data.skill_proficiencies, skill]);
      }
    } else {
      setData('skill_expertises', data.skill_expertises.filter(s => s !== skill));
    }
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setData('languages', [...data.languages, language]);
    } else {
      setData('languages', data.languages.filter(l => l !== language));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skill Proficiencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SKILLS.map((skill) => (
              <div key={skill} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill_${skill}`}
                    checked={data.skill_proficiencies.includes(skill)}
                    onCheckedChange={(checked) => handleSkillProficiencyChange(skill, checked as boolean)}
                  />
                  <Label htmlFor={`skill_${skill}`}>{skill}</Label>
                </div>
                {data.skill_proficiencies.includes(skill) && (
                  <div className="flex items-center space-x-2 ml-6">
                    <Checkbox
                      id={`expertise_${skill}`}
                      checked={data.skill_expertises.includes(skill)}
                      onCheckedChange={(checked) => handleSkillExpertiseChange(skill, checked as boolean)}
                    />
                    <Label htmlFor={`expertise_${skill}`} className="text-sm text-muted-foreground">
                      Expertise
                    </Label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LANGUAGES.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`language_${language}`}
                  checked={data.languages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                />
                <Label htmlFor={`language_${language}`}>{language}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
