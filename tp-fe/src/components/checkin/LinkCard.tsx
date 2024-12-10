import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkCard as LinkCardType } from "../../types";

interface LinkCardProps {
    card: LinkCardType;
}

export const LinkCard: React.FC<LinkCardProps> = ({ card }) => {
    return (
        <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:no-underline"
        >
            <Card className="overflow-hidden hover:bg-gray-50 transition-colors">
                <CardContent className="p-3">
                    <div className="flex gap-4">
                        {card.image && (
                            <div className="flex-shrink-0">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-24 h-24 object-cover rounded"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm line-clamp-2 mb-1 text-gray-900">
                                {card.title}
                            </h3>
                            {card.description && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {card.description}
                                </p>
                            )}
                            <div className="text-xs text-gray-400 truncate mt-1">
                                {card.url}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
};
