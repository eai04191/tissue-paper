import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, Trash } from "lucide-react";
import { ActionMenu } from "../shared/ActionMenu";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { LazyLinkCard } from "./LazyLinkCard";
import { Checkin } from "../../types";
import { createApiClient } from "../../api/client";

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
    const [confirmOpen, setConfirmOpen] = useState(false);
    const api = createApiClient(token);

    const handleDelete = async () => {
        try {
            await api.deleteCheckin(checkin.id);
            onDelete();
        } catch (error) {
            onError("チェックインの削除に失敗しました");
            console.error("Failed to delete checkin:", error);
        }
    };

    const menuItems = [
        {
            label: "削除",
            icon: <Trash size={16} />,
            onClick: () => setConfirmOpen(true),
            className: "text-red-600 focus:text-red-600",
        },
    ];

    return (
        <>
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
                            <ActionMenu items={menuItems} />
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

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="チェックインの削除"
                description="このチェックインを削除しますか？この操作は取り消せません。"
                confirmLabel="削除"
                cancelLabel="キャンセル"
                onConfirm={handleDelete}
                variant="destructive"
            />
        </>
    );
};
