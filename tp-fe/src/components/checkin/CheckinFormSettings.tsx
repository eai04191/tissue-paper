import React from "react";
import { Switch } from "@/components/ui/switch";

interface CheckinFormSettingsProps {
    isPrivate: boolean;
    isTooSensitive: boolean;
    discardElapsedTime: boolean;
    onChangePrivate: (value: boolean) => void;
    onChangeSensitive: (value: boolean) => void;
    onChangeDiscardTime: (value: boolean) => void;
}

export const CheckinFormSettings: React.FC<CheckinFormSettingsProps> = ({
    isPrivate,
    isTooSensitive,
    discardElapsedTime,
    onChangePrivate,
    onChangeSensitive,
    onChangeDiscardTime,
}) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Switch checked={isPrivate} onCheckedChange={onChangePrivate} />
                <label className="text-sm">Private</label>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    checked={isTooSensitive}
                    onCheckedChange={onChangeSensitive}
                />
                <label className="text-sm">Too Sensitive</label>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    checked={discardElapsedTime}
                    onCheckedChange={onChangeDiscardTime}
                />
                <label className="text-sm">Discard Elapsed Time</label>
            </div>
        </div>
    );
};
