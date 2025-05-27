import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sound } from "@/types";
import { router } from "@inertiajs/react";
import { Check, Edit2, Pause, Play, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
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

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("durationchange", updateDuration);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("durationchange", updateDuration);
        };
    }, []);

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

    const handleSeek = (newTime: number[]) => {
        const time = newTime[0];
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const updateSound = (data: Partial<Sound>) => {
        router.put(
            `/sounds/${sound.id}`,
            {
                name: sound.name,
                volume: sound.volume,
                loop: sound.loop,
                ...data,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
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
        if (confirm("Are you sure you want to delete this sound?")) {
            router.delete(`/sounds/${sound.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <Card
            className={`w-full transition-colors ${
                isPlaying ? "border-green-500 border-2" : ""
            }`}
        >
            <CardContent className="p-3">
                <div className="space-y-3">
                    {/* Sound Name */}
                    <div className="flex items-center space-x-2">
                        {isEditing ? (
                            <>
                                <Input
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    className="flex-1"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEdit();
                                        if (e.key === "Escape") cancelEdit();
                                    }}
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={saveEdit}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={cancelEdit}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="font-semibold text-lg flex-1 truncate">
                                    {sound.name}
                                </h3>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Play Button and Volume Control */}
                    <div className="flex items-center space-x-3">
                        <Button
                            onClick={togglePlay}
                            variant={isPlaying ? "secondary" : "default"}
                            size="sm"
                            className="flex-shrink-0"
                        >
                            {isPlaying ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                        </Button>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">
                                    Volume
                                </span>
                                <span className="text-xs font-medium">
                                    {Math.round(volume * 100)}%
                                </span>
                            </div>
                            <Slider
                                value={[volume]}
                                onValueChange={handleVolumeChange}
                                max={1}
                                min={0}
                                step={0.01}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Progress Control */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Progress
                            </span>
                            <span className="text-xs font-medium">
                                {formatTime(currentTime)} /{" "}
                                {formatTime(duration)}
                            </span>
                        </div>
                        <Slider
                            value={[currentTime]}
                            onValueChange={handleSeek}
                            max={duration || 0}
                            min={0}
                            step={0.1}
                            className="w-full"
                            disabled={!duration}
                        />
                    </div>

                    {/* Bottom Controls */}
                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`loop-${sound.id}`}
                                checked={loop}
                                onCheckedChange={handleLoopChange}
                            />
                            <label
                                htmlFor={`loop-${sound.id}`}
                                className="text-xs font-medium"
                            >
                                Loop
                            </label>
                        </div>
                        <Button
                            onClick={deleteSound}
                            variant="destructive"
                            size="icon"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
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
