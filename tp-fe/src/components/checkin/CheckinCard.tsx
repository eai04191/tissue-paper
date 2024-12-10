import { formatDistance } from "date-fns";
import { Link, Pencil, Trash } from "lucide-react";
import React, { useState } from "react";

import type { createApiClient } from "@/api/client";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkin } from "@/types";

import { TransitionText } from "../TransitionText";
import { EditCheckinDialog } from "./EditCheckinDialog";
import { LazyLinkCard } from "./LazyLinkCard";

// 時間帯に応じた絵文字を返す関数を追加
const getTimeEmoji = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "🌅"; // 朝
    if (hour >= 12 && hour < 16) return "☀️"; // 昼
    if (hour >= 16 && hour < 19) return "🌇"; // 夕方
    return "🌙"; // 夜
};

interface CheckinCardProps {
    checkin: Checkin;
    api: ReturnType<typeof createApiClient>;
    onDelete: () => void;
    onError: (error: string) => void;
}

export const CheckinCard: React.FC<CheckinCardProps> = ({
    checkin,
    api,
    onDelete,
    onError,
}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

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
            label: "編集",
            icon: <Pencil size={16} />,
            onClick: () => setEditOpen(true),
        },
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
                <CardHeader className="pb-3.5">
                    <div className="flex items-center justify-between">
                        <TransitionText
                            className="text-sm font-medium flex-1 justify-start text-start"
                            text1={formatDistance(
                                new Date(checkin.checked_in_at),
                                new Date(),
                                { addSuffix: true },
                            )}
                            text2={
                                <>
                                    <span className="font-emoji">
                                        {getTimeEmoji(
                                            new Date(checkin.checked_in_at),
                                        )}
                                    </span>{" "}
                                    {new Date(
                                        checkin.checked_in_at,
                                    ).toLocaleString()}
                                </>
                            }
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                title="Open Permalink"
                            >
                                <a
                                    href={`https://shikorism.net/checkin/${checkin.id}`}
                                    target="_blank"
                                >
                                    <Link size={16} />
                                </a>
                            </Button>
                            <ActionMenu items={menuItems} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {checkin.link && (
                        <LazyLinkCard url={checkin.link} api={api} />
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
                    {checkin.note && (
                        <p className="text-gray-600">{checkin.note}</p>
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

            <EditCheckinDialog
                checkin={checkin}
                api={api}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onDelete} // 履歴を更新
                onError={onError}
            />
        </>
    );
};
