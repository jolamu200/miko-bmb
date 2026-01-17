import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import type { Episode, Season } from "~/features/browse";

const styles = tv({
    slots: {
        root: "mt-6 space-y-4",
        tabs: "flex gap-2 overflow-x-auto pb-2",
        tab: "px-4 py-2 rounded-button text-sm font-medium transition-colors whitespace-nowrap",
        grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
        card: "bg-surface-raised rounded-card p-3 hover:bg-surface-overlay transition-colors",
        epNumber: "text-xs text-muted",
        epName: "text-sm font-medium text-primary line-clamp-1 mt-1",
    },
    variants: {
        active: {
            true: { tab: "bg-accent text-primary", card: "ring-2 ring-accent" },
            false: {
                tab: "bg-surface-raised text-muted hover:text-primary",
                card: "",
            },
        },
    },
});

type EpisodeSelectorProps = {
    tvId: string;
    seasons: Season[];
    episodes: Episode[];
    currentSeason: number;
    currentEpisode: number;
    onSeasonChange: (season: number) => void;
};

/** Season and episode picker for TV shows */
export function EpisodeSelector({
    tvId,
    seasons,
    episodes,
    currentSeason,
    currentEpisode,
    onSeasonChange,
}: EpisodeSelectorProps) {
    const { root, tabs, grid, epNumber, epName } = styles();
    const filteredSeasons = seasons.filter((s) => s.season_number > 0);

    return (
        <div className={root()}>
            <div className={tabs()}>
                {filteredSeasons.map((season) => {
                    const { tab } = styles({
                        active: season.season_number === currentSeason,
                    });
                    return (
                        <button
                            key={season.id}
                            type="button"
                            className={tab()}
                            onClick={() => onSeasonChange(season.season_number)}
                        >
                            Season {season.season_number}
                        </button>
                    );
                })}
            </div>

            <div className={grid()}>
                {episodes.map((ep) => {
                    const { card } = styles({
                        active: ep.episode_number === currentEpisode,
                    });
                    return (
                        <Link
                            key={ep.id}
                            to="/tv/$id/$season/$episode"
                            params={{
                                id: tvId,
                                season: String(currentSeason),
                                episode: String(ep.episode_number),
                            }}
                            className={card()}
                        >
                            <span className={epNumber()}>
                                Episode {ep.episode_number}
                            </span>
                            <p className={epName()}>{ep.name}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
