import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SoundCard from '@/components/SoundCard';
import UploadSound from '@/components/UploadSound';
import { Volume2 } from 'lucide-react';
import { PageProps } from '@/types';

export default function Soundboard({ sounds }: PageProps) {
  const [masterVolume, setMasterVolume] = useState(1);

  return (
    <>
      <Head title="Soundboard" />
      
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">🎵 Soundboard</h1>
          
          {/* Master Volume Control */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Master Volume: {Math.round(masterVolume * 100)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={[masterVolume]}
                onValueChange={(value) => setMasterVolume(value[0])}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Upload Section */}
          <div className="mb-8">
            <UploadSound />
          </div>

          {/* Sounds Grid */}
          {sounds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sounds.map((sound) => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  masterVolume={masterVolume}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground text-lg">
                  No sounds uploaded yet. Upload your first sound to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}