import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Book, Sword, Users, Crown, Scroll, Zap, Target, Star } from 'lucide-react';
import CompendiumFeatureDisplay from '@/components/CompendiumFeatureDisplay';

interface CompendiumEntry {
    id: number;
    name: string;
    entry_type: string;
    is_system: boolean;
    text: string;
    source: string;
    created_at: string;
    updated_at: string;
    specific_data?: any;
}

interface CompendiumShowProps {
    entry: CompendiumEntry;
}

const entryTypeConfig = {
    spell: { icon: Zap, label: 'Spell', color: 'bg-purple-500' },
    item: { icon: Sword, label: 'Item', color: 'bg-amber-500' },
    monster: { icon: Target, label: 'Monster', color: 'bg-red-500' },
    race: { icon: Users, label: 'Race', color: 'bg-blue-500' },
    class: { icon: Crown, label: 'Class', color: 'bg-green-500' },
    subclass: { icon: Star, label: 'Subclass', color: 'bg-purple-600' },
    background: { icon: Book, label: 'Background', color: 'bg-indigo-500' },
    feat: { icon: Scroll, label: 'Feat', color: 'bg-orange-500' },
};

export default function CompendiumShow({ entry }: CompendiumShowProps) {
    const typeConfig = entryTypeConfig[entry.entry_type as keyof typeof entryTypeConfig];
    const Icon = typeConfig?.icon || Book;

    const renderSpecificData = () => {
        // For classes without specific_data, still show a basic layout
        if (!entry.specific_data && entry.entry_type === 'class') {
            return (
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">Class Information</h4>
                        <p className="text-sm text-muted-foreground">
                            This class entry doesn't have detailed mechanical data available, but you can find information in the description above.
                        </p>
                    </div>

                    {/* Show features from the text if available */}
                    <CompendiumFeatureDisplay
                        entry={{
                            name: entry.name,
                            entry_type: entry.entry_type,
                            specific_data: null
                        }}
                    />
                </div>
            );
        }

        if (!entry.specific_data) return null;

        const data = entry.specific_data;

        switch (entry.entry_type) {
            case 'spell':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">Spell Details</h4>
                            <div className="space-y-2 text-sm">
                                <div><strong>Level:</strong> {data.level}</div>
                                <div><strong>School:</strong> {data.school}</div>
                                <div><strong>Ritual:</strong> {data.ritual ? 'Yes' : 'No'}</div>
                                <div><strong>Casting Time:</strong> {data.time}</div>
                                <div><strong>Range:</strong> {data.range}</div>
                                <div><strong>Components:</strong> {data.components}</div>
                                <div><strong>Duration:</strong> {data.duration}</div>
                                <div><strong>Classes:</strong> {data.classes}</div>
                            </div>
                        </div>
                        {data.rolls && data.rolls.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Rolls</h4>
                                <div className="space-y-1 text-sm">
                                    {data.rolls.map((roll: any, index: number) => (
                                        <div key={index}>
                                            <strong>{roll.description}:</strong> {roll.value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'item':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">Item Details</h4>
                            <div className="space-y-2 text-sm">
                                <div><strong>Type:</strong> {data.type}</div>
                                {data.weight && <div><strong>Weight:</strong> {data.weight} lbs</div>}
                                {data.value && <div><strong>Value:</strong> {data.value} gp</div>}
                                {data.ac && <div><strong>AC:</strong> {data.ac}</div>}
                                {data.dmg1 && <div><strong>Damage:</strong> {data.dmg1} {data.dmgType}</div>}
                                {data.range && <div><strong>Range:</strong> {data.range}</div>}
                                <div><strong>Magic:</strong> {data.magic ? 'Yes' : 'No'}</div>
                            </div>
                        </div>
                        {data.property && (
                            <div>
                                <h4 className="font-semibold mb-2">Properties</h4>
                                <div className="text-sm">{data.property}</div>
                            </div>
                        )}
                    </div>
                );

            case 'monster':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Basic Info</h4>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Size:</strong> {data.size}</div>
                                    <div><strong>Type:</strong> {data.type}</div>
                                    <div><strong>Alignment:</strong> {data.alignment}</div>
                                    <div><strong>CR:</strong> {data.cr}</div>
                                    <div><strong>HP:</strong> {data.hp}</div>
                                    <div><strong>Speed:</strong> {data.speed}</div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Ability Scores</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><strong>STR:</strong> {data.str}</div>
                                    <div><strong>DEX:</strong> {data.dex}</div>
                                    <div><strong>CON:</strong> {data.con}</div>
                                    <div><strong>INT:</strong> {data.int}</div>
                                    <div><strong>WIS:</strong> {data.wis}</div>
                                    <div><strong>CHA:</strong> {data.cha}</div>
                                </div>
                            </div>
                        </div>

                        {(data.traits || data.actions) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.traits && data.traits.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Traits</h4>
                                        <div className="space-y-2">
                                            {data.traits.map((trait: any, index: number) => (
                                                <div key={index} className="text-sm">
                                                    <strong>{trait.name}:</strong> {trait.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.actions && data.actions.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Actions</h4>
                                        <div className="space-y-2">
                                            {data.actions.map((action: any, index: number) => (
                                                <div key={index} className="text-sm">
                                                    <strong>{action.name}:</strong> {action.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'race':
                return (
                    <div>
                        <h4 className="font-semibold mb-2">Racial Traits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-sm">
                                {data.size && <div><strong>Size:</strong> {data.size}</div>}
                                {data.speed && <div><strong>Speed:</strong> {data.speed}</div>}
                                {data.ability && <div><strong>Ability Score Increase:</strong> {data.ability}</div>}
                                {data.proficiency && <div><strong>Proficiencies:</strong> {data.proficiency}</div>}
                            </div>
                            {data.traits && data.traits.length > 0 && (
                                <div>
                                    <h5 className="font-medium mb-2">Special Traits</h5>
                                    <div className="space-y-2">
                                        {data.traits.map((trait: any, index: number) => (
                                            <div key={index} className="text-sm">
                                                <strong>{trait.name}:</strong> {trait.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'class':
                return (
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold mb-2">Class Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 text-sm">
                                    {data.hd && <div><strong>Hit Die:</strong> d{data.hd}</div>}
                                    {data.proficiency && <div><strong>Proficiencies:</strong> {data.proficiency}</div>}
                                    {data.numSkills && <div><strong>Skill Choices:</strong> {data.numSkills}</div>}
                                    {data.armor && <div><strong>Armor:</strong> {data.armor}</div>}
                                    {data.weapons && <div><strong>Weapons:</strong> {data.weapons}</div>}
                                    {data.tools && <div><strong>Tools:</strong> {data.tools}</div>}
                                    {data.wealth && <div><strong>Starting Wealth:</strong> {data.wealth}</div>}
                                    {data.spellAbility && <div><strong>Spellcasting Ability:</strong> {data.spellAbility}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Features */}
                        <CompendiumFeatureDisplay
                            entry={{
                                name: entry.name,
                                entry_type: entry.entry_type,
                                specific_data: data
                            }}
                        />
                    </div>
                );

            case 'subclass':
                return (
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold mb-2">Subclass Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 text-sm">
                                    {data.parent_class_id && <div><strong>Parent Class:</strong> Available in database</div>}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Features */}
                        <CompendiumFeatureDisplay
                            entry={{
                                name: entry.name,
                                entry_type: entry.entry_type,
                                specific_data: data
                            }}
                        />
                    </div>
                );

            case 'background':
                return (
                    <div>
                        <h4 className="font-semibold mb-2">Background Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-sm">
                                {data.proficiency && <div><strong>Skill Proficiencies:</strong> {data.proficiency}</div>}
                                {data.languages && <div><strong>Languages:</strong> {data.languages}</div>}
                                {data.equipment && <div><strong>Equipment:</strong> {data.equipment}</div>}
                                {data.gold && <div><strong>Gold:</strong> {data.gold}</div>}
                            </div>
                            {data.traits && data.traits.length > 0 && (
                                <div>
                                    <h5 className="font-medium mb-2">Features</h5>
                                    <div className="space-y-2">
                                        {data.traits.map((trait: any, index: number) => (
                                            <div key={index} className="text-sm">
                                                <strong>{trait.name}:</strong> {trait.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'feat':
                return (
                    <div>
                        <h4 className="font-semibold mb-2">Feat Details</h4>
                        <div className="space-y-2 text-sm">
                            {data.prerequisite && <div><strong>Prerequisite:</strong> {data.prerequisite}</div>}
                            {data.traits && data.traits.length > 0 && (
                                <div>
                                    <h5 className="font-medium mb-2">Benefits</h5>
                                    <div className="space-y-2">
                                        {data.traits.map((trait: any, index: number) => (
                                            <div key={index}>
                                                <strong>{trait.name}:</strong> {trait.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title={`${entry.name} - Compendium`} />

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
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${typeConfig?.color || 'bg-gray-500'} text-white`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">{entry.name}</CardTitle>
                                        <div className="flex gap-2 mt-2">
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

                                {!entry.is_system && (
                                    <div className="flex gap-2">
                                        <Link href={`/compendium/${entry.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Description */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none">
                                {entry.text ? (
                                    <div className="whitespace-pre-wrap">{entry.text}</div>
                                ) : (
                                    <p className="text-gray-500 italic">No description available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specific Data */}
                    {entry.specific_data && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {renderSpecificData()}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
