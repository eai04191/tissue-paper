import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TagSelector } from "./TagSelector";
import { LinkCard } from "./LinkCard";
import { createApiClient } from "../api/client";
import { useQueryParams } from "../hooks/useQueryParams";
import { CreateCheckinPayload, LinkCard as LinkCardType } from "../types";

interface CheckinFormProps {
    token: string;
    onError: (error: string) => void;
    onSuccess: () => void;
}

export const CheckinForm: React.FC<CheckinFormProps> = ({
    token,
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
    const linkPreviewTimeoutRef = useRef<NodeJS.Timeout>();
    const initialFetchRef = useRef(false);
    const api = createApiClient(token);

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

            onSuccess();
        } catch (error) {
            onError(
                error instanceof Error
                    ? error.message
                    : "Failed to create checkin"
            );
        }
    };

    const handleAddTag = (tag: string) => {
        if (!formData.tags?.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), tag],
            }));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
        }));
    };

    // 未使用のサジェストタグを取得
    const unusedSuggestedTags =
        linkCard?.tags
            ?.map((tag) => tag.name)
            .filter((tagName) => !formData.tags?.includes(tagName)) || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Checkin</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Note
                        </label>
                        <Textarea
                            value={formData.note}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    note: e.target.value,
                                }))
                            }
                            className="w-full"
                            placeholder="How was it?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Link
                        </label>
                        <Input
                            type="url"
                            value={formData.link}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    link: e.target.value,
                                }))
                            }
                            placeholder="https://..."
                        />
                    </div>

                    {linkCard && (
                        <div className="mt-2">
                            <LinkCard card={linkCard} />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tags
                        </label>
                        <TagSelector
                            token={token}
                            selectedTags={formData.tags || []}
                            onAddTag={handleAddTag}
                            onRemoveTag={handleRemoveTag}
                        />

                        {unusedSuggestedTags.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2 text-gray-600">
                                    Suggested Tags from URL
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {unusedSuggestedTags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-gray-100 text-gray-600"
                                            onClick={() => handleAddTag(tag)}
                                        >
                                            + {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.is_private}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        is_private: checked,
                                    }))
                                }
                            />
                            <label className="text-sm">Private</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.is_too_sensitive}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        is_too_sensitive: checked,
                                    }))
                                }
                            />
                            <label className="text-sm">Too Sensitive</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.discard_elapsed_time}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        discard_elapsed_time: checked,
                                    }))
                                }
                            />
                            <label className="text-sm">
                                Discard Elapsed Time
                            </label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Check In
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
