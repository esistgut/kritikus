import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Music, Users, ArrowRight, Volume2 } from 'lucide-react';

interface DashboardProps extends PageProps {
    stats: {
        sounds: number;
        characters: number;
    };
    recentSounds: Array<{
        id: number;
        name: string;
        created_at: string;
    }>;
    recentCharacters: Array<{
        id: number;
        name: string;
        created_at: string;
    }>;
}

export default function Dashboard({
    stats,
    recentSounds = [],
    recentCharacters = []
}: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Welcome to Kritikus - Your audio management center
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Sounds
                                </CardTitle>
                                <Music className="h-5 w-5 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.sounds}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Characters
                                </CardTitle>
                                <Users className="h-5 w-5 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.characters}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Quick Access
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href="/soundboard">
                                    <Button className="w-full">
                                        <Volume2 className="h-4 w-4 mr-2" />
                                        Soundboard
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Manage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href="/characters">
                                    <Button className="w-full">
                                        <Users className="h-4 w-4 mr-2" />
                                        Characters
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Items */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Sounds */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-semibold">
                                    Recent Sounds
                                </CardTitle>
                                <Link href="/soundboard">
                                    <Button variant="ghost" size="sm">
                                        View All
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {recentSounds.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentSounds.map((sound) => (
                                            <div
                                                key={sound.id}
                                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Music className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">
                                                        {sound.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(sound.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground mb-3">
                                            No sounds uploaded yet
                                        </p>
                                        <Link href="/soundboard">
                                            <Button size="sm">
                                                Upload First Sound
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Characters */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-semibold">
                                    Recent Characters
                                </CardTitle>
                                <Link href="/characters">
                                    <Button variant="ghost" size="sm">
                                        View All
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {recentCharacters.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentCharacters.map((character) => (
                                            <div
                                                key={character.id}
                                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Users className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium">
                                                        {character.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(character.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground mb-3">
                                            No characters created yet
                                        </p>
                                        <Link href="/characters">
                                            <Button size="sm">
                                                Create First Character
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
