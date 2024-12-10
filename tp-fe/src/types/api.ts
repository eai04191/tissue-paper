export interface ApiError {
    status: number;
    error: {
        message: string;
        violations?: string[];
    };
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}
