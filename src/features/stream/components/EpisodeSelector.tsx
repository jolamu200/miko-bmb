import { Tabs } from "@base-ui/react/tabs";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import type { Episode, Season } from "~/features/browse";

const styles = tv({
    slots: {
        root: "mt-8 space-y-5",
        sectionTitle:
            "text-lg font-semibold text-primary flex items-center gap-2 mb-4",
        tabsList: "flex gap-2 overflow-x-auto pb-3 scrollbar-hide",
        tab: "px-4 py-2.5 rounded-button text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 glass text-muted hover:text-primary hover:bg-white/6 data-[selected]:bg-gradient-to-r data-[selected]:from-accent data-[selected]:to-yellow-600 data-[selected]:text-surface data-[selected]:shadow-lg data-[selected]:shadow-accent/25",
        grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
        card: "glass rounded-card p-4 transition-all duration-300 group cursor-pointer hover:bg-white/6 hover:ring-1 hover:ring-white/10",
        cardActive:
            "glass rounded-card p-4 transition-all duration-300 group cursor-pointer ring-2 ring-accent shadow-lg shadow-accent/15 bg-white/4",
        cardContent: "flex items-start justify-between",
        epInfo: "flex-1",
        epNumber: "text-xs text-muted flex items-center gap-1.5",
        epName: "text-sm font-medium text-primary line-clamp-1 mt-1.5",
        playIcon:
            "size-8 text-muted group-hover:text-accent transition-colors duration-300 opacity-0 group-hover:opacity-100",
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
    const s = styles();
    const filteredSeasons = seasons.filter(
        (season) => season.season_number > 0,
    );

    return (
        <Tabs.Root
            value={currentSeason}
            onValueChange={(value) => onSeasonChange(value as number)}
            className={s.root()}
        >
            <h3 className={s.sectionTitle()}>
                <Icon icon="mdi:playlist-play" className="size-5 text-accent" />
                Select Episode
            </h3>

            <Tabs.List className={s.tabsList()}>
                {filteredSeasons.map((season) => (
                    <Tabs.Tab
                        key={season.id}
                        value={season.season_number}
                        className={s.tab()}
                    >
                        <Icon icon="mdi:folder-play" className="size-4" />
                        Season {season.season_number}
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {filteredSeasons.map((season) => (
                <Tabs.Panel key={season.id} value={season.season_number}>
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
                                className={
                                    ep.episode_number === currentEpisode
                                        ? s.cardActive()
                                        : s.card()
                                }
                            >
                                <div className={s.cardContent()}>
                                    <div className={s.epInfo()}>
                                        <span className={s.epNumber()}>
                                            <Icon
                                                icon="mdi:movie-play"
                                                className="size-3.5"
                                            />
                                            Episode {ep.episode_number}
                                        </span>
                                        <p className={s.epName()}>{ep.name}</p>
                                    </div>
                                    <Icon
                                        icon="mdi:play-circle"
                                        className={s.playIcon()}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </Tabs.Panel>
            ))}
        </Tabs.Root>
    );
}
