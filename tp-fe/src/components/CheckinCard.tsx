import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, MoreHorizontal, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LazyLinkCard } from "./LazyLinkCard";
import { Checkin } from "../types";
import { createApiClient } from "../api/client";

interface CheckinCardProps {
    checkin: Checkin;
    token: string;
    onDelete: () => void;
    onError: (error: string) => void;
}

export const CheckinCard: React.FC<CheckinCardProps> = ({
    checkin,
    token,
    onDelete,
    onError,
}) => {
    const api = createApiClient(token);

    const handleDelete = async () => {
        if (!confirm("このチェックインを削除しますか？")) return;

        try {
            await api.deleteCheckin(checkin.id);
            onDelete();
        } catch (error) {
            onError("チェックインの削除に失敗しました");
            console.error("Failed to delete checkin:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {format(new Date(checkin.checked_in_at), "PPpp")}
                    </span>
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://shikorism.net/checkin/${checkin.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                            title="Permalink"
                        >
                            <Link size={16} />
                        </a>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                >
                                    <MoreHorizontal size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={handleDelete}
                                >
                                    <Trash size={16} className="mr-2" />
                                    削除
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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
    );
};
