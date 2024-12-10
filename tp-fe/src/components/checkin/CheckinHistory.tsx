import React, { useEffect, useState } from "react";

import type { createApiClient } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkin } from "@/types";

import { CheckinCard } from "./CheckinCard";

interface CheckinHistoryProps {
    api: ReturnType<typeof createApiClient>;
    onError: (error: string) => void;
}

export const CheckinHistory: React.FC<CheckinHistoryProps> = ({
    api,
    onError,
}) => {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [loading, setLoading] = useState(false);

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
    }, []);

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
                    api={api}
                    onDelete={handleCheckinDelete}
                    onError={onError}
                />
            ))}
        </div>
    );
};
