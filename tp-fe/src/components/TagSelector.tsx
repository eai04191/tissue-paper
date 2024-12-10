// components/TagSelector.tsx
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export const TagSelector = ({ token, onSelectTag }) => {
    const [recentTags, setRecentTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                // First, get the user info
                const userResponse = await fetch(
                    "http://localhost:3001/api/v1/me",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const userData = await userResponse.json();

                // Then get the user's tag stats
                const tagsResponse = await fetch(
                    `http://localhost:3001/api/v1/users/${userData.name}/stats/tags`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (tagsResponse.ok) {
                    const tags = await tagsResponse.json();
                    setRecentTags(tags.map((t) => t.name));
                }
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }
        };

        fetchTags();
    }, [token]);

    return (
        <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Recent Tags</h3>
            <div className="flex flex-wrap gap-2">
                {recentTags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => onSelectTag(tag)}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    );
};
