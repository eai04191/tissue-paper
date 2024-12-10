import React from "react";

import { Input } from "@/components/ui/input";
import { LinkCard as LinkCardType } from "@/types";

import { LinkCard } from "./LinkCard";

interface CheckinFormLinkProps {
    value: string;
    linkCard: LinkCardType | null;
    onChange: (value: string) => void;
}

export const CheckinFormLink: React.FC<CheckinFormLinkProps> = ({
    value,
    linkCard,
    onChange,
}) => {
    return (
        <div className="space-y-2">
            <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <Input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                />
            </div>

            {linkCard && (
                <div className="mt-2">
                    <LinkCard card={linkCard} />
                </div>
            )}
        </div>
    );
};
