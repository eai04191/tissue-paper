import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createApiClient } from "../api/client";
import { TagStats } from "../types";

interface TagSelectorProps {
    token: string;
    selectedTags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
    token,
    selectedTags,
    onAddTag,
    onRemoveTag,
}) => {
    const [recentTags, setRecentTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const api = createApiClient(token);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const user = await api.getCurrentUser();

                // 統計からのタグを取得
                const tagStats = await api.getUserTagStats(user.name);
                const statsTagSet = new Set(tagStats.map((stat) => stat.name));

                // 直近のチェックインからタグを取得 (最新20件)
                const recentCheckins = await api.getUserCheckins(
                    user.name,
                    1,
                    20
                );
                const recentTagSet = new Set(
                    recentCheckins.flatMap((checkin) => checkin.tags || [])
                );

                // 両方のタグをマージして重複を排除
                const allTags = Array.from(
                    new Set([...statsTagSet, ...recentTagSet])
                ).sort((a, b) => a.localeCompare(b, "ja")); // 日本語対応のソート

                setRecentTags(allTags);
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }
        };

        fetchTags();
    }, [token]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
            onAddTag(newTag.trim());
            setNewTag("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => onRemoveTag(tag)}
                    >
                        {tag} ×
                    </Badge>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add new tag... (press Enter to add)"
                    className="flex-1"
                />
            </form>

            {recentTags.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium mb-2">Recent Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {recentTags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                                onClick={() => onAddTag(tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
