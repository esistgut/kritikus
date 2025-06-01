import { Character } from '@/types';
import CompendiumFeatureDisplay from '@/components/CompendiumFeatureDisplay';

interface ClassFeaturesProps {
  character: Character;
}

export default function ClassFeatures({ character }: ClassFeaturesProps) {
  const classData = character.character_class?.dnd_class;
  const subclassData = character.subclass?.subclass;

  return (
    <div className="space-y-6">
      {/* Class Features */}
      {classData && (
        <CompendiumFeatureDisplay
          entry={{
            name: character.character_class?.name || 'Unknown Class',
            entry_type: 'class',
            specific_data: classData
          }}
          maxLevel={character.level}
        />
      )}

      {/* Subclass Features */}
      {subclassData && character.subclass && (
        <CompendiumFeatureDisplay
          entry={{
            name: character.subclass.name,
            entry_type: 'subclass',
            specific_data: subclassData
          }}
          maxLevel={character.level}
        />
      )}
    </div>
  );
}
