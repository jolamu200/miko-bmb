import { tv } from "tailwind-variants";
import { Skeleton } from "~/ui/Skeleton";
import type { MediaItem } from "../types";
import { MediaCard } from "./MediaCard";

const grid = tv({
    base: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
});

type MediaGridProps = {
    items: MediaItem[] | undefined;
    isLoading?: boolean;
    mediaType?: "movie" | "tv";
};

/** Responsive grid of media cards */
export function MediaGrid({ items, isLoading, mediaType }: MediaGridProps) {
    if (isLoading) {
        return (
            <div className={grid()}>
                {Array.from({ length: 12 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
                    <Skeleton key={i} variant="card" />
                ))}
            </div>
        );
    }

    return (
        <div className={grid()}>
            {items?.map((item) => (
                <MediaCard key={item.id} item={item} mediaType={mediaType} />
            ))}
        </div>
    );
}
