export interface Sound {
    id: number;
    name: string;
    filename: string;
    original_filename: string;
    volume: number;
    loop: boolean;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface Character {
    id: number;
    name: string;
    class: string;
    race: string;
    background: string;
    level: number;
    experience: number;

    // Ability Scores
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;

    // Combat Stats
    armor_class: number;
    initiative: number;
    speed: number;
    hit_point_maximum: number;
    current_hit_points: number;
    temporary_hit_points: number;
    hit_dice: number;
    hit_dice_total: number;

    // Saving Throw Proficiencies
    strength_save_proficiency: boolean;
    dexterity_save_proficiency: boolean;
    constitution_save_proficiency: boolean;
    intelligence_save_proficiency: boolean;
    wisdom_save_proficiency: boolean;
    charisma_save_proficiency: boolean;

    // Proficiencies and Languages
    skill_proficiencies: string[];
    skill_expertises: string[];
    languages: string[];
    armor_proficiencies: string[];
    weapon_proficiencies: string[];
    tool_proficiencies: string[];

    // Features and Combat
    features_and_traits: Feature[];
    attacks_and_spells: Attack[];
    equipment: Equipment[];

    // Character Details
    personality_traits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;
    backstory?: string;

    // Spellcasting
    spellcasting_class?: string;
    spell_attack_bonus: number;
    spell_save_dc: number;
    spell_slots: SpellSlot[];
    spells_known: Spell[];

    created_at: string;
    updated_at: string;
}

export interface Feature {
    name: string;
    description: string;
    source: string;
}

export interface Attack {
    name: string;
    attack_bonus: number;
    damage: string;
    damage_type: string;
    range?: string;
    description?: string;
}

export interface Equipment {
    name: string;
    quantity: number;
    weight?: number;
    value?: string;
    description?: string;
}

export interface SpellSlot {
    level: number;
    total: number;
    used: number;
}

export interface Spell {
    name: string;
    level: number;
    school: string;
    casting_time: string;
    range: string;
    components: string;
    duration: string;
    description: string;
    prepared?: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
    sounds?: Sound[];
    characters?: Character[];
    character?: Character;
    flash?: {
        message?: string;
    };
    [key: string]: any;
}
