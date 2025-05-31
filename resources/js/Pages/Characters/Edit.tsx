import { Character, CompendiumData, PageProps } from '@/types';
import CharacterForm from '@/components/Characters/CharacterForm';

interface EditCharacterProps extends PageProps {
  character: Character;
  compendiumData: CompendiumData;
}

export default function Edit({ character, compendiumData, auth }: EditCharacterProps) {
  return (
    <CharacterForm
      mode="edit"
      character={character}
      compendiumData={compendiumData}
      auth={auth}
    />
  );
}
