import { CompendiumData, PageProps } from '@/types';
import CharacterForm from '@/components/Characters/CharacterForm';

interface CreateCharacterProps extends PageProps {
  compendiumData: CompendiumData;
}

export default function Create({ compendiumData, auth }: CreateCharacterProps) {
  return (
    <CharacterForm
      mode="create"
      compendiumData={compendiumData}
      auth={auth}
    />
  );
}
