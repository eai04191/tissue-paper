import { MoreHorizontal } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    className?: string;
}

interface ActionMenuProps {
    items: ActionMenuItem[];
    align?: "start" | "end" | "center";
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
    items,
    align = "end",
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                    <MoreHorizontal size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align}>
                {items.map((item, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={item.onClick}
                        className={item.className}
                    >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
