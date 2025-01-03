import React, { useEffect, useRef, useState } from "react";

import type { createApiClient } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkCard as LinkCardType } from "@/types";

import { LinkCard } from "./LinkCard";

interface LazyLinkCardProps {
    url: string;
    api: ReturnType<typeof createApiClient>;
}

export const LazyLinkCard: React.FC<LazyLinkCardProps> = ({ url, api }) => {
    const [card, setCard] = useState<LinkCardType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !fetchedRef.current) {
                    fetchedRef.current = true;
                    fetchCard();
                }
            },
            {
                rootMargin: "100px",
                threshold: 0,
            },
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [url]);

    const fetchCard = async () => {
        setLoading(true);
        try {
            const data = await api.getLinkCard(url);
            if (data) {
                setCard(data);
            } else {
                setError(true);
            }
        } catch (e) {
            console.error("Failed to fetch card:", e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef}>
            {loading ? (
                <Skeleton className="h-24 w-full" />
            ) : card ? (
                <LinkCard card={card} />
            ) : error || !card ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm block"
                >
                    {url}
                </a>
            ) : null}
        </div>
    );
};
