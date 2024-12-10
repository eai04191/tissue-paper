import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagSelector } from "./TagSelector";
import { createApiClient } from "../api/client";
import { CreateCheckinPayload } from "../types";

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
    const [formData, setFormData] = useState<CreateCheckinPayload>({
        note: "",
        link: "",
        tags: [],
        is_private: false,
        is_too_sensitive: false,
        discard_elapsed_time: false,
    });

    const api = createApiClient(token);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCheckin(formData);

            // Show confetti animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#ff0000", "#00ff00", "#0000ff"],
                ticks: 200,
            });

            // Reset form
            setFormData({
                note: "",
                link: "",
                tags: [],
                is_private: false,
                is_too_sensitive: false,
                discard_elapsed_time: false,
            });

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
