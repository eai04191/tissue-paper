import {
    User,
    Checkin,
    CreateCheckinPayload,
    TagStats,
    LinkCard,
} from "../types";

const API_BASE_URL = "http://localhost:3001/api";

class ApiClient {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "API request failed");
        }

        if (options.method === "DELETE") {
            return {} as T;
        }

        return response.json();
    }

    async getCurrentUser(): Promise<User> {
        return this.request<User>("/v1/me");
    }

    async getUserCheckins(
        username: string,
        page: number = 1,
        perPage: number = 20
    ): Promise<Checkin[]> {
        return this.request<Checkin[]>(
            `/v1/users/${username}/checkins?page=${page}&per_page=${perPage}`
        );
    }

    async getUserTagStats(username: string): Promise<TagStats[]> {
        return this.request<TagStats[]>(`/v1/users/${username}/stats/tags`);
    }

    async getLinkCard(url: string): Promise<LinkCard | null> {
        try {
            const encodedUrl = encodeURIComponent(url);
            const response = await this.request<LinkCard>(
                `/checkin/card?url=${encodedUrl}`
            );
            return response;
        } catch (error) {
            console.error("Failed to fetch link card:", error);
            return null;
        }
    }

    async createCheckin(data: CreateCheckinPayload): Promise<Checkin> {
        return this.request<Checkin>("/v1/checkins", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async deleteCheckin(checkinId: number): Promise<void> {
        return this.request<void>(`/v1/checkins/${checkinId}`, {
            method: "DELETE",
        });
    }
}

export const createApiClient = (token: string) => new ApiClient(token);
