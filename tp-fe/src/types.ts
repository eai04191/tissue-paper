export interface User {
    name: string;
    display_name: string;
    is_protected: boolean;
    private_likes: boolean;
    bio?: string;
    url?: string;
    checkin_summary?: CheckinSummary;
}

export interface CheckinSummary {
    current_session_elapsed: number;
    total_checkins: number;
    total_times: number;
    average_interval: number;
    longest_interval: number;
    shortest_interval: number;
}

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

export interface TagStats {
    name: string;
    count: number;
}

export type ApiError = {
    status: number;
    error: {
        message: string;
        violations?: string[];
    };
};

export interface LinkCard {
    url: string;
    title: string;
    description: string;
    image: string;
    tags: { name: string }[];
}

// APIクライアントの戻り値の型
export interface ApiResponse<T> {
    status?: number;
    error?: {
        message: string;
        violations?: string[];
    };
    data?: T;
}
