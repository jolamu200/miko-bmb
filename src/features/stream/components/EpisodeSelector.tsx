import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import {
    type Episode,
    getStillUrl,
    type Season,
} from "~/features/browse/types";

const styles = tv({
    slots: {
        root: "mt-8 space-y-5",
        header: "mb-4",
        sectionTitle:
            "text-lg font-semibold text-primary flex items-center gap-2",
        tabsList: "flex gap-2 overflow-x-auto pb-3 scrollbar-hide",
        tab: "px-4 py-2.5 rounded-button text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 glass text-muted hover:text-primary hover:bg-white/6 data-selected:bg-linear-to-r data-selected:from-accent data-selected:to-yellow-600 data-selected:text-surface data-selected:shadow-lg data-selected:shadow-accent/25",
        grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
        card: "glass rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer hover:bg-white/6 hover:ring-1 hover:ring-white/10",
        cardActive:
            "glass rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer ring-2 ring-accent shadow-lg shadow-accent/15 bg-white/4",
        epNumber: "text-xs text-muted flex items-center gap-1.5",
        epName: "text-sm font-medium text-primary line-clamp-1 mt-1.5",
        still: "w-full aspect-video object-cover",
        cardContent: "p-3",
        meta: "flex items-center gap-2 text-xs text-muted mt-1.5",
        overview: "text-xs text-muted line-clamp-2 mt-1.5",
    },
});

type EpisodeSelectorProps = {
    tvId: string;
    seasons: Season[];
    episodes: Episode[];
    currentSeason: number;
    currentEpisode: number;
};

/** Season and episode picker for TV shows */
export function EpisodeSelector({
    tvId,
    seasons,
    episodes,
    currentSeason,
    currentEpisode,
}: EpisodeSelectorProps) {
    const s = styles();
    const filteredSeasons = seasons.filter(
        (season) => season.season_number > 0,
    );

    return (
        <div className={s.root()}>
            <div className={s.header()}>
                <h3 className={s.sectionTitle()}>
                    <Icon
                        icon="mdi:playlist-play"
                        className="size-5 text-accent"
                    />
                    Select Episode
                </h3>
            </div>

            <div className={s.tabsList()}>
                {filteredSeasons.map((season) => (
                    <Link
                        key={season.id}
                        to="/tv/$id/$season/$episode"
                        params={{
                            id: tvId,
                            season: String(season.season_number),
                            episode: "1",
                        }}
                        resetScroll={false}
                        className={s.tab()}
                        data-selected={
                            season.season_number === currentSeason || undefined
                        }
                    >
                        <Icon icon="mdi:folder-play" className="size-4" />
                        Season {season.season_number}
                    </Link>
                ))}
            </div>

            <div className={s.grid()}>
                {episodes.map((ep) => (
                    <Link
                        key={ep.id}
                        to="/tv/$id/$season/$episode"
                        params={{
                            id: tvId,
                            season: String(currentSeason),
                            episode: String(ep.episode_number),
                        }}
                        resetScroll={false}
                        className={
                            ep.episode_number === currentEpisode
                                ? s.cardActive()
                                : s.card()
                        }
                    >
                        <img
                            src={getStillUrl(ep.still_path)}
                            alt={ep.name}
                            className={s.still()}
                        />
                        <div className={s.cardContent()}>
                            <span className={s.epNumber()}>
                                <Icon
                                    icon="mdi:movie-play"
                                    className="size-3.5"
                                />
                                Episode {ep.episode_number}
                            </span>
                            <p className={s.epName()}>{ep.name}</p>
                            {ep.runtime && (
                                <span className={s.meta()}>
                                    <Icon
                                        icon="mdi:clock-outline"
                                        className="size-3"
                                    />
                                    {ep.runtime} min
                                </span>
                            )}
                            {ep.overview && (
                                <p className={s.overview()}>{ep.overview}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
