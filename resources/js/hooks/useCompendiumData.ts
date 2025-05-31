import { useState, useEffect } from 'react';
import axios from 'axios';
import { CompendiumEntry } from '@/types';

interface UseCompendiumDataReturn {
    races: CompendiumEntry[];
    classes: CompendiumEntry[];
    backgrounds: CompendiumEntry[];
    spells: CompendiumEntry[];
    feats: CompendiumEntry[];
    items: CompendiumEntry[];
    loading: boolean;
    error: string | null;
}

export function useCompendiumData(): UseCompendiumDataReturn {
    const [data, setData] = useState<{
        races: CompendiumEntry[];
        classes: CompendiumEntry[];
        backgrounds: CompendiumEntry[];
        spells: CompendiumEntry[];
        feats: CompendiumEntry[];
        items: CompendiumEntry[];
    }>({
        races: [],
        classes: [],
        backgrounds: [],
        spells: [],
        feats: [],
        items: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [racesRes, classesRes, backgroundsRes, spellsRes, featsRes, itemsRes] = await Promise.all([
                    axios.get('/api/compendium/race'),
                    axios.get('/api/compendium/class'),
                    axios.get('/api/compendium/background'),
                    axios.get('/api/compendium/spell'),
                    axios.get('/api/compendium/feat'),
                    axios.get('/api/compendium/item'),
                ]);

                setData({
                    races: racesRes.data,
                    classes: classesRes.data,
                    backgrounds: backgroundsRes.data,
                    spells: spellsRes.data,
                    feats: featsRes.data,
                    items: itemsRes.data,
                });

                setError(null);
            } catch (err) {
                console.error('Error fetching compendium data:', err);
                setError('Failed to load compendium data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        ...data,
        loading,
        error,
    };
}
