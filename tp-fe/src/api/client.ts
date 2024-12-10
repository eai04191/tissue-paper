import {
    Checkin,
    CreateCheckinPayload,
    LinkCard,
    TagStats,
    User,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

class ApiClient {
    private token: string;
    private user: { data: User; timestamp: number } | null = null;
    private readonly CACHE_TTL = 1000 * 60 * 5; // 5分

    constructor(token: string) {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<{ data: T; response: Response }> {
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
            return { response } as { data: T; response: Response };
        }

        const data = await response.json();
        return { data, response };
    }

    async getCurrentUser(): Promise<User> {
        const now = Date.now();
        if (this.user && now - this.user.timestamp < this.CACHE_TTL) {
            return this.user.data;
        }

        const data = (await this.request<User>("/v1/me")).data;
        this.user = { data, timestamp: now };
        return data;
    }

    async getUserCheckins(
        username: string,
        page: number = 1,
        perPage: number = 20,
    ): Promise<{ data: Checkin[]; totalCount: number }> {
        if (perPage > 100 || perPage < 10) {
            throw new Error("perPage must be between 10 and 100");
        }

        const result = await this.request<Checkin[]>(
            `/v1/users/${username}/checkins?page=${page}&per_page=${perPage}`,
        );

        return {
            data: result.data,
            totalCount: Number(result.response.headers.get("X-Total-Count")),
        };
    }

    async getUserTagStats(username: string): Promise<TagStats[]> {
        return (
            await this.request<TagStats[]>(`/v1/users/${username}/stats/tags`)
        ).data;
    }

    async getLinkCard(url: string): Promise<LinkCard | null> {
        try {
            const encodedUrl = encodeURIComponent(url);
            const response = await this.request<LinkCard>(
                `/checkin/card?url=${encodedUrl}`,
            );
            return response.data;
        } catch (error) {
            console.error("Failed to fetch link card:", error);
            return null;
        }
    }

    async createCheckin(data: CreateCheckinPayload): Promise<Checkin> {
        return (
            await this.request<Checkin>("/v1/checkins", {
                method: "POST",
                body: JSON.stringify(data),
            })
        ).data;
    }

    async updateCheckin(
        checkinId: number,
        data: CreateCheckinPayload,
    ): Promise<Checkin> {
        return (
            await this.request<Checkin>(`/v1/checkins/${checkinId}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            })
        ).data;
    }

    async deleteCheckin(checkinId: number): Promise<void> {
        return (
            await this.request<void>(`/v1/checkins/${checkinId}`, {
                method: "DELETE",
            })
        ).data;
    }

    clearCache() {
        this.user = null;
    }
}

export const createApiClient = (token: string) => new ApiClient(token);
