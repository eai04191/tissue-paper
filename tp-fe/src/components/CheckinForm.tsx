// components/CheckinForm.tsx
import React, { useState } from "react";
import { TagSelector } from "./TagSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const CheckinForm = ({ token, onError }) => {
    const [formData, setFormData] = useState({
        note: "",
        link: "",
        tags: [],
        is_private: false,
        is_too_sensitive: false,
        discard_elapsed_time: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:3001/api/v1/checkins",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.error?.message || "Failed to create checkin"
                );
            }

            setFormData({
                note: "",
                link: "",
                tags: [],
                is_private: false,
                is_too_sensitive: false,
                discard_elapsed_time: false,
            });
            onError("");
        } catch (error) {
            onError(error.message);
        }
    };

    const handleAddTag = (tag) => {
        if (!formData.tags.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tag],
            }));
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <Textarea
                    value={formData.note}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            note: e.target.value,
                        }))
                    }
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <Input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            link: e.target.value,
                        }))
                    }
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                        >
                            {tag} ×
                        </Badge>
                    ))}
                </div>
                <TagSelector token={token} onSelectTag={handleAddTag} />
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
                    <label className="text-sm">Discard Elapsed Time</label>
                </div>
            </div>

            <Button type="submit" className="w-full">
                Check In
            </Button>
        </form>
    );
};
