import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";
import { Skeleton } from "~/ui/Skeleton";
import type { MediaItem } from "../types";
import { MediaCard } from "./MediaCard";

const styles = tv({
    slots: {
        root: "space-y-4",
        header: "flex items-center justify-between px-1",
        titleWrapper: "flex items-center gap-2.5",
        titleIcon: "size-5 text-accent",
        title: "text-lg font-semibold text-primary",
        viewAll:
            "flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors duration-300",
        scroll: "flex gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide snap-x snap-mandatory",
        item: "shrink-0 w-36 md:w-44 snap-start",
    },
});

type MediaRowProps = {
    title: string;
    items: MediaItem[] | undefined;
    isLoading?: boolean;
    mediaType?: "movie" | "tv";
    onRemove?: (item: MediaItem) => void;
};

/** Gets an appropriate icon for a row title */
function getRowIcon(rowTitle: string): string {
    const lower = rowTitle.toLowerCase();
    if (lower.includes("continue")) return "mdi:history";
    if (lower.includes("for you")) return "mdi:account-star";
    if (lower.includes("trending")) return "mdi:fire";
    if (lower.includes("popular")) return "mdi:chart-line";
    if (lower.includes("top rated") || lower.includes("top-rated"))
        return "mdi:trophy";
    if (lower.includes("new") || lower.includes("latest"))
        return "mdi:sparkles";
    if (lower.includes("recommend") || lower.includes("like"))
        return "mdi:thumb-up";
    if (lower.includes("action")) return "mdi:sword-cross";
    if (lower.includes("comedy")) return "mdi:emoticon-happy";
    if (lower.includes("drama")) return "mdi:drama-masks";
    if (lower.includes("horror")) return "mdi:ghost";
    if (lower.includes("sci-fi") || lower.includes("science"))
        return "mdi:rocket-launch";
    return "mdi:movie-roll";
}

/** Horizontal scrolling row of media cards */
export function MediaRow({
    title: rowTitle,
    items,
    isLoading,
    mediaType,
    onRemove,
}: MediaRowProps) {
    const { root, header, titleWrapper, titleIcon, title, scroll, item } =
        styles();

    return (
        <section className={root()}>
            <div className={header()}>
                <div className={titleWrapper()}>
                    <Icon icon={getRowIcon(rowTitle)} className={titleIcon()} />
                    <h2 className={title()}>{rowTitle}</h2>
                </div>
            </div>
            <div className={scroll()}>
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: this is fine.
                          <div key={i} className={item()}>
                              <Skeleton variant="card" />
                          </div>
                      ))
                    : items?.map((media) => (
                          <div key={media.id} className={item()}>
                              <MediaCard
                                  item={media}
                                  mediaType={mediaType}
                                  onRemove={
                                      onRemove
                                          ? () => onRemove(media)
                                          : undefined
                                  }
                              />
                          </div>
                      ))}
            </div>
        </section>
    );
}
