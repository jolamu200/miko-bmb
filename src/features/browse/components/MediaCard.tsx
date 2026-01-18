import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { WatchlistButton } from "~/features/watchlist/components/WatchlistButton";
import { posterCardStyles } from "~/ui/cardStyles";
import type { MediaItem } from "../types";
import { getPosterUrl, getReleaseYear, getTitle } from "../types";

const styles = tv({
    extend: posterCardStyles,
    slots: {
        card: "cursor-pointer",
        ratingIcon: "text-accent",
        ratingValue: "text-primary",
        actions:
            "absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0",
        removeButton:
            "p-2 rounded-full bg-black/60 text-muted hover:text-red-400 hover:bg-black/80 ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95",
        removeIcon: "size-4",
    },
});

type MediaCardProps = {
    item: MediaItem;
    mediaType?: "movie" | "tv";
    onRemove?: () => void;
};

/** Poster card for movie or TV show */
export function MediaCard({ item, mediaType, onRemove }: MediaCardProps) {
    const type = mediaType || item.media_type || "movie";
    const href = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
    const s = styles();
    const itemTitle = getTitle(item);
    const year = getReleaseYear(item);
    const rating = item.vote_average?.toFixed(1) || "N/A";

    return (
        <Link to={href} className={s.card()}>
            <div className={s.imageWrapper()}>
                <img
                    src={getPosterUrl(item.poster_path)}
                    alt={itemTitle}
                    className={s.poster()}
                    loading="lazy"
                />
                <div className={s.gradientOverlay()} />
                <div className={s.shine()} />

                <div className={s.badge()}>
                    <Icon
                        icon="mdi:star"
                        className={`${s.badgeIcon()} ${s.ratingIcon()}`}
                    />
                    <span className={s.ratingValue()}>{rating}</span>
                </div>

                <div className={s.playButton()}>
                    <Icon icon="mdi:play" className={s.playIcon()} />
                </div>

                <div className={s.actions()}>
                    {onRemove && (
                        <button
                            type="button"
                            className={s.removeButton()}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemove();
                            }}
                            aria-label="Remove from history"
                        >
                            <Icon icon="mdi:close" className={s.removeIcon()} />
                        </button>
                    )}
                    <WatchlistButton
                        id={item.id}
                        mediaType={type}
                        title={itemTitle}
                        posterPath={item.poster_path}
                    />
                </div>

                <div className={s.content()}>
                    <h3 className={s.title()}>{itemTitle}</h3>
                    <div className={s.meta()}>
                        <span>{year}</span>
                        <span className={s.metaDot()} />
                        <span>{type === "movie" ? "Movie" : "Series"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
