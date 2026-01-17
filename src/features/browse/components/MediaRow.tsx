import { tv } from "tailwind-variants";
import { Skeleton } from "~/ui/Skeleton";
import type { MediaItem } from "../types";
import { MediaCard } from "./MediaCard";

const styles = tv({
    slots: {
        root: "space-y-3",
        header: "flex items-center justify-between",
        title: "text-lg font-semibold text-primary",
        scroll: "flex gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide",
        item: "shrink-0 w-36 md:w-44",
    },
});

type MediaRowProps = {
    title: string;
    items: MediaItem[] | undefined;
    isLoading?: boolean;
    mediaType?: "movie" | "tv";
};

/** Horizontal scrolling row of media cards */
export function MediaRow({
    title: rowTitle,
    items,
    isLoading,
    mediaType,
}: MediaRowProps) {
    const { root, header, title, scroll, item } = styles();

    return (
        <section className={root()}>
            <div className={header()}>
                <h2 className={title()}>{rowTitle}</h2>
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
                              <MediaCard item={media} mediaType={mediaType} />
                          </div>
                      ))}
            </div>
        </section>
    );
}
