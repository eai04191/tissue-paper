import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "lucide-react";
import { createApiClient } from "../api/client";
import { Checkin } from "../types";
import { LazyLinkCard } from "./LazyLinkCard";
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

    useEffect(() => {
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

        fetchCheckins();
    }, [token, refreshTrigger]);

    if (loading) {
        return (
            <div className="space-y-4 mt-8">
                <h2 className="text-xl font-bold">Recent Checkins</h2>
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
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
        <div className="space-y-4 mt-8">
            <h2 className="text-xl font-bold">Recent Checkins</h2>
            {checkins.map((checkin) => (
                <Card key={checkin.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {format(
                                    new Date(checkin.checked_in_at),
                                    "PPpp"
                                )}
                            </CardTitle>
                            <a
                                href={`https://shikorism.net/checkin/${checkin.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600"
                                title="Permalink"
                            >
                                <Link size={16} />
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {checkin.note && (
                            <p className="text-gray-600">{checkin.note}</p>
                        )}
                        {checkin.link && (
                            <LazyLinkCard url={checkin.link} token={token} />
                        )}
                        {checkin.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {checkin.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
