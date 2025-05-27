import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Trash2, Edit2, Check, X } from 'lucide-react';
import { Sound } from '@/types';

interface SoundCardProps {
  sound: Sound;
  masterVolume: number;
}

export default function SoundCard({ sound, masterVolume }: SoundCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(sound.name);
  const [volume, setVolume] = useState(sound.volume);
  const [loop, setLoop] = useState(sound.loop);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume * masterVolume;
    }
  }, [volume, masterVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, [loop]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    updateSound({ volume: vol });
  };

  const handleLoopChange = (checked: boolean) => {
    setLoop(checked);
    updateSound({ loop: checked });
  };

  const updateSound = (data: Partial<Sound>) => {
    router.put(`/sounds/${sound.id}`, {
      name: sound.name,
      volume: sound.volume,
      loop: sound.loop,
      ...data,
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const saveEdit = () => {
    updateSound({ name: editName });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditName(sound.name);
    setIsEditing(false);
  };

  const deleteSound = () => {
    if (confirm('Are you sure you want to delete this sound?')) {
      router.delete(`/sounds/${sound.id}`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Sound Name */}
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                />
                <Button size="icon" variant="ghost" onClick={saveEdit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg flex-1 truncate">{sound.name}</h3>
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Play/Pause Button */}
          <Button
            onClick={togglePlay}
            className="w-full"
            variant={isPlaying ? "secondary" : "default"}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          {/* Volume Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* Loop Control */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`loop-${sound.id}`}
              checked={loop}
              onCheckedChange={handleLoopChange}
            />
            <label htmlFor={`loop-${sound.id}`} className="text-sm font-medium">
              Loop
            </label>
          </div>

          {/* Delete Button */}
          <Button
            onClick={deleteSound}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={sound.url}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />
      </CardContent>
    </Card>
  );
}
