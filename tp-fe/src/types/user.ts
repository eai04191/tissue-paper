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
