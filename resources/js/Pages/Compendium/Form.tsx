import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Book, Sword, Users, Crown, Scroll, Zap, Target } from 'lucide-react';

interface CompendiumFormProps {
    entry?: {
        id?: number;
        name: string;
        entry_type: string;
        text: string;
        source: string;
        specific_data?: any;
    };
    isEdit?: boolean;
}

const entryTypes = [
    { value: 'spell', label: 'Spell', icon: Zap },
    { value: 'item', label: 'Item', icon: Sword },
    { value: 'monster', label: 'Monster', icon: Target },
    { value: 'race', label: 'Race', icon: Users },
    { value: 'class', label: 'Class', icon: Crown },
    { value: 'background', label: 'Background', icon: Book },
    { value: 'feat', label: 'Feat', icon: Scroll },
];

export default function CompendiumForm({ entry, isEdit = false }: CompendiumFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: entry?.name || '',
        entry_type: entry?.entry_type || '',
        text: entry?.text || '',
        source: entry?.source || '',
        specific_data: entry?.specific_data || {},
    });

    const [selectedType, setSelectedType] = useState(entry?.entry_type || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && entry?.id) {
            put(`/compendium/${entry.id}`);
        } else {
            post('/compendium');
        }
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        setData('entry_type', value);
        // Reset specific data when type changes
        setData('specific_data', {});
    };

    const updateSpecificData = (field: string, value: any) => {
        setData('specific_data', {
            ...data.specific_data,
            [field]: value,
        });
    };

    const renderSpecificFields = () => {
        switch (selectedType) {
            case 'spell':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Spell Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="level">Level</Label>
                                <Input
                                    id="level"
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={data.specific_data.level || ''}
                                    onChange={(e) => updateSpecificData('level', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="school">School</Label>
                                <Select
                                    value={data.specific_data.school || ''}
                                    onValueChange={(value: string) => updateSpecificData('school', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select school" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="abjuration">Abjuration</SelectItem>
                                        <SelectItem value="conjuration">Conjuration</SelectItem>
                                        <SelectItem value="divination">Divination</SelectItem>
                                        <SelectItem value="enchantment">Enchantment</SelectItem>
                                        <SelectItem value="evocation">Evocation</SelectItem>
                                        <SelectItem value="illusion">Illusion</SelectItem>
                                        <SelectItem value="necromancy">Necromancy</SelectItem>
                                        <SelectItem value="transmutation">Transmutation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="time">Casting Time</Label>
                                <Input
                                    id="time"
                                    value={data.specific_data.time || ''}
                                    onChange={(e) => updateSpecificData('time', e.target.value)}
                                    placeholder="e.g., 1 action"
                                />
                            </div>
                            <div>
                                <Label htmlFor="range">Range</Label>
                                <Input
                                    id="range"
                                    value={data.specific_data.range || ''}
                                    onChange={(e) => updateSpecificData('range', e.target.value)}
                                    placeholder="e.g., 60 feet"
                                />
                            </div>
                            <div>
                                <Label htmlFor="components">Components</Label>
                                <Input
                                    id="components"
                                    value={data.specific_data.components || ''}
                                    onChange={(e) => updateSpecificData('components', e.target.value)}
                                    placeholder="e.g., V, S, M"
                                />
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    value={data.specific_data.duration || ''}
                                    onChange={(e) => updateSpecificData('duration', e.target.value)}
                                    placeholder="e.g., 1 minute"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="classes">Classes</Label>
                                <Input
                                    id="classes"
                                    value={data.specific_data.classes || ''}
                                    onChange={(e) => updateSpecificData('classes', e.target.value)}
                                    placeholder="e.g., Wizard, Sorcerer"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="ritual"
                                    checked={data.specific_data.ritual || false}
                                    onCheckedChange={(checked) => updateSpecificData('ritual', checked)}
                                />
                                <Label htmlFor="ritual">Ritual</Label>
                            </div>
                        </div>
                    </div>
                );

            case 'item':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Item Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Input
                                    id="type"
                                    value={data.specific_data.type || ''}
                                    onChange={(e) => updateSpecificData('type', e.target.value)}
                                    placeholder="e.g., Weapon, Armor, Wondrous item"
                                />
                            </div>
                            <div>
                                <Label htmlFor="weight">Weight (lbs)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    value={data.specific_data.weight || ''}
                                    onChange={(e) => updateSpecificData('weight', parseFloat(e.target.value) || null)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="value">Value (gp)</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    value={data.specific_data.value || ''}
                                    onChange={(e) => updateSpecificData('value', parseInt(e.target.value) || null)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="ac">Armor Class</Label>
                                <Input
                                    id="ac"
                                    type="number"
                                    value={data.specific_data.ac || ''}
                                    onChange={(e) => updateSpecificData('ac', parseInt(e.target.value) || null)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="dmg1">Damage</Label>
                                <Input
                                    id="dmg1"
                                    value={data.specific_data.dmg1 || ''}
                                    onChange={(e) => updateSpecificData('dmg1', e.target.value)}
                                    placeholder="e.g., 1d8"
                                />
                            </div>
                            <div>
                                <Label htmlFor="dmgType">Damage Type</Label>
                                <Input
                                    id="dmgType"
                                    value={data.specific_data.dmgType || ''}
                                    onChange={(e) => updateSpecificData('dmgType', e.target.value)}
                                    placeholder="e.g., slashing"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="property">Properties</Label>
                                <Input
                                    id="property"
                                    value={data.specific_data.property || ''}
                                    onChange={(e) => updateSpecificData('property', e.target.value)}
                                    placeholder="e.g., finesse, light"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="magic"
                                    checked={data.specific_data.magic || false}
                                    onCheckedChange={(checked) => updateSpecificData('magic', checked)}
                                />
                                <Label htmlFor="magic">Magic Item</Label>
                            </div>
                        </div>
                    </div>
                );

            case 'race':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Racial Traits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="size">Size</Label>
                                <Select
                                    value={data.specific_data.size || ''}
                                    onValueChange={(value: string) => updateSpecificData('size', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Small">Small</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="speed">Speed</Label>
                                <Input
                                    id="speed"
                                    value={data.specific_data.speed || ''}
                                    onChange={(e) => updateSpecificData('speed', e.target.value)}
                                    placeholder="e.g., 30 feet"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="ability">Ability Score Increase</Label>
                                <Input
                                    id="ability"
                                    value={data.specific_data.ability || ''}
                                    onChange={(e) => updateSpecificData('ability', e.target.value)}
                                    placeholder="e.g., Your Dexterity score increases by 2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="proficiency">Proficiencies</Label>
                                <Input
                                    id="proficiency"
                                    value={data.specific_data.proficiency || ''}
                                    onChange={(e) => updateSpecificData('proficiency', e.target.value)}
                                    placeholder="e.g., Longswords, shortbows"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'feat':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Feat Details</h3>
                        <div>
                            <Label htmlFor="prerequisite">Prerequisite</Label>
                            <Input
                                id="prerequisite"
                                value={data.specific_data.prerequisite || ''}
                                onChange={(e) => updateSpecificData('prerequisite', e.target.value)}
                                placeholder="e.g., Strength 13 or higher"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title={`${isEdit ? 'Edit' : 'Create'} Compendium Entry`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Back button */}
                    <div className="mb-6">
                        <Link href="/compendium">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Compendium
                            </Button>
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Fill in the basic details for your compendium entry
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="entry_type">Type *</Label>
                                    <Select
                                        value={selectedType}
                                        onValueChange={handleTypeChange}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select entry type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {entryTypes.map((type) => {
                                                const Icon = type.icon;
                                                return (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="h-4 w-4" />
                                                            {type.label}
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {errors.entry_type && <p className="text-sm text-red-600 mt-1">{errors.entry_type}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="source">Source</Label>
                                    <Input
                                        id="source"
                                        value={data.source}
                                        onChange={(e) => setData('source', e.target.value)}
                                        placeholder="e.g., Player's Handbook, Custom"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="text">Description *</Label>
                                    <Textarea
                                        id="text"
                                        value={data.text}
                                        onChange={(e) => setData('text', e.target.value)}
                                        rows={6}
                                        required
                                    />
                                    {errors.text && <p className="text-sm text-red-600 mt-1">{errors.text}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {selectedType && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Type-Specific Details</CardTitle>
                                    <CardDescription>
                                        Additional details specific to {entryTypes.find(t => t.value === selectedType)?.label}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderSpecificFields()}
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex justify-end gap-4">
                            <Link href="/compendium">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Saving...' : (isEdit ? 'Update Entry' : 'Create Entry')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
