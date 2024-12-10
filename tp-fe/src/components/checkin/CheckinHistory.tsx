import React, { useState, useEffect } from "react";
import { createApiClient } from "../../api/client";
import { Checkin } from "../../types";
import { CheckinCard } from "./CheckinCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CheckinHistoryProps {
    token: string;
    onError: (error: string) => void;
    refreshTrigger: number;
}

export const CheckinHistory: React.FC<CheckinHistoryProps> = ({
    token,
    onError,
    refreshTrigger,
}) => {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [loading, setLoading] = useState(false);
    const api = createApiClient(token);

    const fetchCheckins = async () => {
        setLoading(true);
        try {
            const user = await api.getCurrentUser();
            const userCheckins = await api.getUserCheckins(user.name);
            setCheckins(userCheckins);
        } catch (error) {
            onError("Failed to fetch checkin history");
            console.error("Failed to fetch checkins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCheckins();
    }, [token, refreshTrigger]);

    const handleCheckinDelete = () => {
        fetchCheckins();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Recent Checkins</h2>
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <Skeleton className="h-48 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (checkins.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-4">
                No checkins yet
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Recent Checkins</h2>
            {checkins.map((checkin) => (
                <CheckinCard
                    key={checkin.id}
                    checkin={checkin}
                    token={token}
                    onDelete={handleCheckinDelete}
                    onError={onError}
                />
            ))}
        </div>
    );
};
