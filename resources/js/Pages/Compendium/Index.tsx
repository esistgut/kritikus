import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Book, Sword, Users, Crown, Scroll, Zap, Target } from 'lucide-react';

interface CompendiumEntry {
    id: number;
    name: string;
    entry_type: string;
    is_system: boolean;
    text: string;
    source: string;
    created_at: string;
    updated_at: string;
}

interface CompendiumIndexProps {
    entries: {
        data: CompendiumEntry[];
        links: any;
        meta: any;
    };
    filter: {
        type: string;
        search: string;
        source: string;
    };
    stats: {
        total: number;
        system: number;
        user: number;
        types: Record<string, number>;
    };
}

const entryTypeConfig = {
    spell: { icon: Zap, label: 'Spells', color: 'bg-purple-500' },
    item: { icon: Sword, label: 'Items', color: 'bg-amber-500' },
    monster: { icon: Target, label: 'Monsters', color: 'bg-red-500' },
    race: { icon: Users, label: 'Races', color: 'bg-blue-500' },
    class: { icon: Crown, label: 'Classes', color: 'bg-green-500' },
    background: { icon: Book, label: 'Backgrounds', color: 'bg-indigo-500' },
    feat: { icon: Scroll, label: 'Feats', color: 'bg-orange-500' },
};

export default function CompendiumIndex({ entries, filter, stats }: CompendiumIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filter.search || '');
    const [selectedType, setSelectedType] = useState(filter.type || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate with search params
        window.location.href = `/compendium?search=${searchTerm}&type=${selectedType}`;
    };

    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
        window.location.href = `/compendium?search=${searchTerm}&type=${type}`;
    };

    return (
        <AppLayout>
            <Head title="Compendium" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header with stats */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">D&D 5e Compendium</h1>
                                <p className="text-gray-600">
                                    Browse and manage D&D content - {stats.total} total entries
                                </p>
                            </div>
                            <Link href="/compendium/create">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Custom Entry
                                </Button>
                            </Link>
                        </div>

                        {/* Stats overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            {Object.entries(entryTypeConfig).map(([type, config]) => {
                                const Icon = config.icon;
                                const count = stats.types[type] || 0;
                                return (
                                    <Card
                                        key={type}
                                        className={`cursor-pointer transition-all hover:shadow-md ${
                                            selectedType === type ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                        onClick={() => handleTypeFilter(type)}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className={`inline-flex p-2 rounded-full ${config.color} text-white mb-2`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="text-sm font-medium">{config.label}</div>
                                            <div className="text-lg font-bold">{count}</div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search compendium entries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button type="submit">
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </form>

                        <div className="flex gap-2 mt-4 flex-wrap">
                            <Button
                                variant={selectedType === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleTypeFilter('all')}
                            >
                                All Types
                            </Button>
                            {Object.entries(entryTypeConfig).map(([type, config]) => (
                                <Button
                                    key={type}
                                    variant={selectedType === type ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleTypeFilter(type)}
                                >
                                    {config.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Entries list */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="p-6">
                            <div className="grid gap-4">
                                {entries.data.map((entry) => {
                                    const typeConfig = entryTypeConfig[entry.entry_type as keyof typeof entryTypeConfig];
                                    const Icon = typeConfig?.icon || Book;

                                    return (
                                        <Card key={entry.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${typeConfig?.color || 'bg-gray-500'} text-white`}>
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-lg">
                                                                <Link
                                                                    href={`/compendium/${entry.id}`}
                                                                    className="hover:text-blue-600"
                                                                >
                                                                    {entry.name}
                                                                </Link>
                                                            </CardTitle>
                                                            <div className="flex gap-2 mt-1">
                                                                <Badge variant={entry.is_system ? 'secondary' : 'default'}>
                                                                    {entry.is_system ? 'System' : 'Custom'}
                                                                </Badge>
                                                                <Badge variant="outline">
                                                                    {typeConfig?.label || entry.entry_type}
                                                                </Badge>
                                                                {entry.source && (
                                                                    <Badge variant="outline">{entry.source}</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="line-clamp-3">
                                                    {entry.text || 'No description available.'}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* Pagination would go here */}
                            {entries.data.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No entries found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
