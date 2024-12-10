export interface Checkin {
    id: number;
    checked_in_at: string;
    tags: string[];
    link?: string;
    note?: string;
    is_private: boolean;
    is_too_sensitive: boolean;
    discard_elapsed_time: boolean;
    source: "web" | "csv" | "webhook" | "api";
}

export interface CreateCheckinPayload {
    checked_in_at?: string;
    note?: string;
    link?: string;
    tags?: string[];
    is_private?: boolean;
    is_too_sensitive?: boolean;
    discard_elapsed_time?: boolean;
}

export interface LinkCard {
    url: string;
    title: string;
    description: string;
    image: string;
    tags: { name: string }[];
}

export interface TagStats {
    name: string;
    count: number;
}
