import { Character, PageProps } from '@/types';
import CharacterForm from '@/components/Characters/CharacterForm';

interface EditCharacterProps extends PageProps {
  character: Character;
}

export default function Edit({ character, auth }: EditCharacterProps) {
  return (
    <CharacterForm
      mode="edit"
      character={character}
      auth={auth}
    />
  );
}
