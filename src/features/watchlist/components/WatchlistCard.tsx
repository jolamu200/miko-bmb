import { Tooltip } from "@base-ui/react/tooltip";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { useMovieDetail, useTvDetail } from "~/features/browse/hooks/useTmdb";
import { getPosterUrl, getTitle } from "~/features/browse/types";
import { posterCardStyles } from "~/ui/cardStyles";
import { Skeleton } from "~/ui/Skeleton";
import { useRemoveFromWatchlist } from "../hooks/useWatchlist";
import type { WatchlistItem } from "../types";

const styles = tv({
    extend: posterCardStyles,
    slots: {
        imageWrapper: "block",
        typeBadge:
            "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent/90 text-surface text-xs font-semibold uppercase tracking-wide flex items-center gap-1",
        removeButton:
            "absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110 active:scale-95",
        tooltip:
            "px-2.5 py-1.5 text-xs font-medium bg-neutral-900 text-primary rounded-button shadow-xl shadow-black/60 border border-white/10 animate-fade-in",
    },
});

type WatchlistCardProps = {
    item: WatchlistItem;
};

/** Card for watchlist items with remove action */
export function WatchlistCard({ item }: WatchlistCardProps) {
    const s = styles();
    const removeFromWatchlist = useRemoveFromWatchlist();
    const idStr = String(item.id);

    const { data: movie, isLoading: movieLoading } = useMovieDetail(
        item.mediaType === "movie" ? idStr : "",
    );
    const { data: tv, isLoading: tvLoading } = useTvDetail(
        item.mediaType === "tv" ? idStr : "",
    );

    const isLoading = item.mediaType === "movie" ? movieLoading : tvLoading;
    const detail = item.mediaType === "movie" ? movie : tv;

    if (isLoading || !detail) {
        return <Skeleton variant="video" />;
    }

    const title = getTitle(detail);
    const posterPath = detail.poster_path;
    const href =
        item.mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

    return (
        <div className={s.card()}>
            <Link to={href} className={s.imageWrapper()}>
                <img
                    src={getPosterUrl(posterPath)}
                    alt={title}
                    className={s.poster()}
                    loading="lazy"
                />
                <div className={s.gradientOverlay()} />
                <div className={s.shine()} />

                <div className={s.typeBadge()}>
                    <Icon
                        icon={
                            item.mediaType === "movie"
                                ? "mdi:movie"
                                : "mdi:television"
                        }
                        className="size-3"
                    />
                    {item.mediaType === "movie" ? "Movie" : "Series"}
                </div>

                <div className={s.playButton()}>
                    <Icon icon="mdi:play" className={s.playIcon()} />
                </div>

                <div className={s.content()}>
                    <p className={s.title()}>{title}</p>
                    <p className={s.meta()}>
                        <Icon
                            icon="mdi:bookmark-check"
                            className="size-3.5 text-accent"
                        />
                        <span>Saved</span>
                    </p>
                </div>
            </Link>

            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        render={
                            <button
                                type="button"
                                className={s.removeButton()}
                                onClick={() =>
                                    removeFromWatchlist.mutate({
                                        mediaType: item.mediaType,
                                        id: item.id,
                                    })
                                }
                                aria-label="Remove from watchlist"
                            >
                                <Icon icon="mdi:close" className="size-4" />
                            </button>
                        }
                    />
                    <Tooltip.Portal>
                        <Tooltip.Positioner sideOffset={8}>
                            <Tooltip.Popup className={s.tooltip()}>
                                Remove from watchlist
                            </Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    );
}
