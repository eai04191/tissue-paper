import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkin, CreateCheckinPayload } from "../../types";
import { createApiClient } from "../../api/client";
import { CheckinFormNote } from "./CheckinFormNote";
import { CheckinFormLink } from "./CheckinFormLink";
import { CheckinFormTags } from "./CheckinFormTags";
import { CheckinFormSettings } from "./CheckinFormSettings";

interface EditCheckinDialogProps {
    checkin: Checkin;
    token: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    onError: (error: string) => void;
}

export const EditCheckinDialog: React.FC<EditCheckinDialogProps> = ({
    checkin,
    token,
    open,
    onOpenChange,
    onSuccess,
    onError,
}) => {
    const [formData, setFormData] = useState<CreateCheckinPayload>({
        note: checkin.note,
        link: checkin.link,
        tags: checkin.tags,
        is_private: checkin.is_private,
        is_too_sensitive: checkin.is_too_sensitive,
        discard_elapsed_time: checkin.discard_elapsed_time,
    });

    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const api = createApiClient(token);

    // リンクが変更された時にカード情報を取得
    useEffect(() => {
        const fetchLinkCard = async () => {
            if (!formData.link) {
                setSuggestedTags([]);
                return;
            }

            try {
                const card = await api.getLinkCard(formData.link);
                if (card?.tags) {
                    const newTags = card.tags.map((tag) => tag.name);
                    setSuggestedTags(newTags);
                }
            } catch (error) {
                console.error("Failed to fetch link card:", error);
            }
        };

        fetchLinkCard();
    }, [formData.link]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.updateCheckin(checkin.id, formData);
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            onError(
                error instanceof Error
                    ? error.message
                    : "Failed to update checkin"
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Checkin</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CheckinFormNote
                        value={formData.note || ""}
                        onChange={(note) =>
                            setFormData((prev) => ({ ...prev, note }))
                        }
                    />

                    <CheckinFormLink
                        value={formData.link || ""}
                        linkCard={null} // 編集画面ではプレビューを省略
                        onChange={(link) =>
                            setFormData((prev) => ({ ...prev, link }))
                        }
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tags
                        </label>
                        <CheckinFormTags
                            token={token}
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

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Update</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
