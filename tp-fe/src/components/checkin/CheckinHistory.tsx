import { formatDistance, formatDuration, intervalToDuration } from "date-fns";
import React, { useEffect, useState } from "react";

import type { createApiClient } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkin } from "@/types";

import { TransitionText } from "../TransitionText";
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
    const [totalCheckins, setTotalCheckins] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCheckins = async () => {
        setLoading(true);
        try {
            const user = await api.getCurrentUser();
            const userCheckins = await api.getUserCheckins(user.name);
            setCheckins(userCheckins.data);
            setTotalCheckins(userCheckins.totalCount);
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

    const renderTimelineGroup = (checkins: Checkin[]) => {
        const getElapsedTime = (current: Checkin, next: Checkin) => {
            return formatDistance(
                new Date(current.checked_in_at),
                new Date(next.checked_in_at),
            );
        };

        const getDetailedTime = (current: Checkin, next: Checkin) => {
            const duration = intervalToDuration({
                start: new Date(next.checked_in_at),
                end: new Date(current.checked_in_at),
            });

            return formatDuration(duration);
        };

        return checkins.map((checkin, index) => (
            <React.Fragment key={checkin.id}>
                <CheckinCard
                    checkin={checkin}
                    api={api}
                    onDelete={handleCheckinDelete}
                    onError={onError}
                />
                {index < checkins.length - 1 && (
                    <TransitionText
                        className="text-sm text-gray-400 text-center"
                        text1={getElapsedTime(checkin, checkins[index + 1])}
                        text2={getDetailedTime(checkin, checkins[index + 1])}
                    />
                )}
            </React.Fragment>
        ));
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
            <div className="flex justify-between items-center text-xl font-bold">
                <h2>Checkins</h2>
                <span className="text-2xl opacity-30">#{totalCheckins}</span>
            </div>
            {renderTimelineGroup(checkins)}
        </div>
    );
};
