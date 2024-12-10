import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createApiClient } from "../../api/client";

interface CheckinFormTagsProps {
    token: string;
    selectedTags: string[];
    suggestedTags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

export const CheckinFormTags: React.FC<CheckinFormTagsProps> = ({
    token,
    selectedTags,
    suggestedTags,
    onAddTag,
    onRemoveTag,
}) => {
    const [newTag, setNewTag] = useState("");
    const [recentTags, setRecentTags] = useState<string[]>([]);
    const api = createApiClient(token);

    // 直近使用したタグを取得
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
                    20,
                );
                const recentTagSet = new Set(
                    recentCheckins.flatMap((checkin) => checkin.tags || []),
                );

                // 両方のタグをマージして重複を排除
                const allTags = Array.from(
                    new Set([...statsTagSet, ...recentTagSet]),
                ).sort((a, b) => a.localeCompare(b, "ja")); // 日本語対応のソート

                setRecentTags(allTags);
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }
        };

        fetchTags();
    }, [token]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
                onAddTag(newTag.trim());
                setNewTag("");
            }
        }
    };

    // 選択済みのタグを除外したサジェストタグとRecentタグ
    const unusedSuggestedTags = suggestedTags.filter(
        (tag) => !selectedTags.includes(tag),
    );
    const unusedRecentTags = recentTags.filter(
        (tag) => !selectedTags.includes(tag),
    );

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

            <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add new tag... (press Enter to add)"
                className="flex-1"
            />

            {unusedRecentTags.length > 0 && (
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Recent Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {unusedRecentTags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => onAddTag(tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {unusedSuggestedTags.length > 0 && (
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                        Suggested Tags from URL
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {unusedSuggestedTags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="cursor-pointer hover:bg-gray-100 text-gray-600"
                                onClick={() => onAddTag(tag)}
                            >
                                + {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
