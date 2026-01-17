import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import type { MediaItem } from "../types";
import { getPosterUrl, getReleaseYear, getTitle } from "../types";

const styles = tv({
    slots: {
        card: "group relative overflow-hidden rounded-card bg-surface-raised transition-transform hover:scale-105",
        poster: "aspect-2/3 w-full object-cover",
        overlay:
            "absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
        content:
            "absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform",
        title: "text-sm font-medium text-primary line-clamp-1",
        meta: "flex items-center gap-2 text-xs text-muted mt-1",
    },
});

type MediaCardProps = {
    item: MediaItem;
    mediaType?: "movie" | "tv";
};

/** Poster card for movie or TV show */
export function MediaCard({ item, mediaType }: MediaCardProps) {
    const type = mediaType || item.media_type || "movie";
    const href = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
    const { card, poster, overlay, content, title, meta } = styles();

    return (
        <Link to={href} className={card()}>
            <img
                src={getPosterUrl(item.poster_path)}
                alt={getTitle(item)}
                className={poster()}
                loading="lazy"
            />
            <div className={overlay()} />
            <div className={content()}>
                <h3 className={title()}>{getTitle(item)}</h3>
                <div className={meta()}>
                    <span>{getReleaseYear(item)}</span>
                    <span className="flex items-center gap-0.5">
                        <Icon icon="mdi:star" className="text-yellow-500" />
                        {item.vote_average.toFixed(1)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
