import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { Character, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import CharacterCard from '@/components/Characters/CharacterCard';

interface CharactersIndexProps extends PageProps {
  characters: Character[];
}

export default function Index({ characters }: CharactersIndexProps) {
  const handleDelete = (character: Character) => {
    if (confirm(`Are you sure you want to delete ${character.name}? This action cannot be undone.`)) {
      router.delete(`/characters/${character.id}`);
    }
  };

  return (
    <AppLayout>
      <Head title="Character Manager" />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Character Manager</h1>
              <p className="text-muted-foreground mt-2">
                Manage your D&D 2024 character sheets
              </p>
            </div>
            <Link href="/characters/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Character
              </Button>
            </Link>
          </div>

          {characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">No Characters Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first D&D character to get started with your adventure!
                  </p>
                  <Link href="/characters/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Character
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
