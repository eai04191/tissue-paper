import confetti from "canvas-confetti";
import React, { useEffect, useRef, useState } from "react";

import type { createApiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/useQueryParams";
import { CreateCheckinPayload, LinkCard as LinkCardType } from "@/types";

import { CheckinFormLink } from "./CheckinFormLink";
import { CheckinFormNote } from "./CheckinFormNote";
import { CheckinFormSettings } from "./CheckinFormSettings";
import { CheckinFormTags } from "./CheckinFormTags";

interface CheckinFormProps {
    api: ReturnType<typeof createApiClient>;
    onError: (error: string) => void;
    onSuccess: () => void;
}

export const CheckinForm: React.FC<CheckinFormProps> = ({
    api,
    onError,
    onSuccess,
}) => {
    const queryParams = useQueryParams();

    const [formData, setFormData] = useState<CreateCheckinPayload>({
        note: queryParams.note,
        link: queryParams.link,
        tags: queryParams.tags,
        is_private: false,
        is_too_sensitive: false,
        discard_elapsed_time: false,
    });

    const [linkCard, setLinkCard] = useState<LinkCardType | null>(null);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const linkPreviewTimeoutRef = useRef<NodeJS.Timeout>();
    const initialFetchRef = useRef(false);

    // クエリパラメータのリンクがある場合は初回のみカード情報を取得
    useEffect(() => {
        if (formData.link && !initialFetchRef.current) {
            initialFetchRef.current = true;
            fetchLinkCard(formData.link);
        }
    }, []);

    // リンク入力時のカード情報取得
    useEffect(() => {
        if (linkPreviewTimeoutRef.current) {
            clearTimeout(linkPreviewTimeoutRef.current);
        }

        if (!formData.link) {
            setLinkCard(null);
            setSuggestedTags([]);
            return;
        }

        linkPreviewTimeoutRef.current = setTimeout(() => {
            fetchLinkCard(formData.link!);
        }, 500);

        return () => {
            if (linkPreviewTimeoutRef.current) {
                clearTimeout(linkPreviewTimeoutRef.current);
            }
        };
    }, [formData.link]);

    const fetchLinkCard = async (url: string) => {
        try {
            const card = await api.getLinkCard(url);
            setLinkCard(card);

            // サジェストタグを設定
            if (card?.tags) {
                const newTags = card.tags.map((tag) => tag.name);
                setSuggestedTags(newTags);
            }
        } catch (error) {
            console.error("Failed to fetch link card:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCheckin(formData);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });

            // フォームクリア後、URLからクエリパラメータを削除
            window.history.replaceState(null, "", window.location.pathname);

            setFormData({
                note: "",
                link: "",
                tags: [],
                is_private: false,
                is_too_sensitive: false,
                discard_elapsed_time: false,
            });
            setLinkCard(null);
            setSuggestedTags([]);

            onSuccess();
        } catch (error) {
            onError(
                error instanceof Error
                    ? error.message
                    : "Failed to create checkin",
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Checkin</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CheckinFormLink
                        value={formData.link || ""}
                        linkCard={linkCard}
                        onChange={(link) =>
                            setFormData((prev) => ({ ...prev, link }))
                        }
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tags
                        </label>
                        <CheckinFormTags
                            api={api}
                            selectedTags={formData.tags || []}
                            suggestedTags={suggestedTags}
                            onAddTag={(tag) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tags: [...(prev.tags || []), tag],
                                }))
                            }
                            onRemoveTag={(tag) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tags:
                                        prev.tags?.filter((t) => t !== tag) ||
                                        [],
                                }))
                            }
                        />
                    </div>

                    <CheckinFormNote
                        value={formData.note || ""}
                        onChange={(note) =>
                            setFormData((prev) => ({ ...prev, note }))
                        }
                    />

                    <CheckinFormSettings
                        isPrivate={formData.is_private || false}
                        isTooSensitive={formData.is_too_sensitive || false}
                        discardElapsedTime={
                            formData.discard_elapsed_time || false
                        }
                        onChangePrivate={(is_private) =>
                            setFormData((prev) => ({ ...prev, is_private }))
                        }
                        onChangeSensitive={(is_too_sensitive) =>
                            setFormData((prev) => ({
                                ...prev,
                                is_too_sensitive,
                            }))
                        }
                        onChangeDiscardTime={(discard_elapsed_time) =>
                            setFormData((prev) => ({
                                ...prev,
                                discard_elapsed_time,
                            }))
                        }
                    />

                    <Button type="submit" className="w-full">
                        Check In
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
