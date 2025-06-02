import { PageProps } from '@/types';
import CharacterForm from '@/components/Characters/CharacterForm';

interface CreateCharacterProps extends PageProps {
}

export default function Create({ auth }: CreateCharacterProps) {
  return (
    <CharacterForm
      mode="create"
      auth={auth}
    />
  );
}
