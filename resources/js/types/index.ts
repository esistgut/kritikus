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

export interface PageProps {
    sounds: Sound[];
    flash?: {
        message?: string;
    };
}