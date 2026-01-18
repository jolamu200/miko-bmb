import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { getPosterUrl } from "~/features/browse/types";

const styles = tv({
    slots: {
        card: "group bg-surface-raised rounded-card overflow-hidden ring-1 ring-white/5 hover:ring-accent/40 hover:shadow-xl hover:shadow-accent/15 transition-all duration-400 hover:scale-[1.02]",
        poster: "w-full aspect-2/3 object-cover transition-transform duration-500 group-hover:scale-105",
        info: "p-4 text-left",
        name: "font-medium text-sm",
        meta: "text-xs text-muted mt-1 flex items-center gap-1",
    },
});

type SeasonCardProps = {
    tvId: string;
    seasonNumber: number;
    name: string;
    episodeCount: number;
    posterPath?: string | null;
};

/** Card for displaying a TV season with navigation to first episode */
export function SeasonCard({
    tvId,
    seasonNumber,
    name,
    episodeCount,
    posterPath,
}: SeasonCardProps) {
    const s = styles();

    return (
        <Link
            to="/tv/$id/$season/$episode"
            params={{
                id: tvId,
                season: String(seasonNumber),
                episode: "1",
            }}
            className={s.card()}
        >
            <img
                src={getPosterUrl(posterPath ?? null, "w342")}
                alt={name}
                className={s.poster()}
            />
            <div className={s.info()}>
                <p className={s.name()}>{name}</p>
                <p className={s.meta()}>
                    <Icon icon="mdi:movie-play" className="size-3.5" />
                    {episodeCount} episodes
                </p>
            </div>
        </Link>
    );
}
