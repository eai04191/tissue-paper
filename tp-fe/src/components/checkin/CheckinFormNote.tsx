import React from "react";

import { Textarea } from "@/components/ui/textarea";

interface CheckinFormNoteProps {
    value: string;
    onChange: (value: string) => void;
}

export const CheckinFormNote: React.FC<CheckinFormNoteProps> = ({
    value,
    onChange,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">Note</label>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
                placeholder="How was it?"
            />
        </div>
    );
};
