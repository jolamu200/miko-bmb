import { Icon } from "@iconify/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { MediaRow } from "~/features/browse/components/MediaRow";
import {
    useRecommendations,
    useTvDetail,
} from "~/features/browse/hooks/useTmdb";
import {
    getBackdropUrl,
    getPosterUrl,
    getTitle,
} from "~/features/browse/types";
import { Button } from "~/ui/Button";

export const Route = createFileRoute("/tv/$id/")({
    component: TvShowPage,
});

const styles = tv({
    slots: {
        page: "min-h-screen text-primary",
        backdrop: "relative h-64 md:h-96 bg-cover bg-center",
        gradient:
            "absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/20",
        container:
            "max-w-5xl mx-auto px-4 pb-8 -mt-32 relative z-10 animate-fade-up",
        header: "flex gap-6",
        poster: "w-32 md:w-48 rounded-card shadow-2xl ring-1 ring-white/10 flex-shrink-0 hover:scale-105 transition-transform duration-500",
        info: "flex flex-col justify-end",
        title: "text-2xl md:text-3xl font-bold",
        meta: "flex flex-wrap gap-4 mt-3 text-sm text-muted",
        metaItem: "flex items-center gap-1.5",
        overview: "mt-6 text-muted leading-relaxed glass rounded-card p-5",
        sectionTitle:
            "text-xl font-semibold mt-10 mb-5 flex items-center gap-2",
        seasonGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5",
        seasonCard:
            "group bg-surface-raised rounded-card overflow-hidden ring-1 ring-white/5 hover:ring-accent/40 hover:shadow-xl hover:shadow-accent/15 transition-all duration-400 cursor-pointer hover:scale-[1.02]",
        seasonPoster:
            "w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105",
        seasonInfo: "p-4 text-left",
        seasonName: "font-medium text-sm",
        seasonMeta: "text-xs text-muted mt-1 flex items-center gap-1",
        recommendations: "mt-12",
    },
});

function TvShowPage() {
    const {
        page,
        backdrop,
        gradient,
        container,
        header,
        poster,
        info,
        title,
        meta,
        metaItem,
        overview,
        sectionTitle,
        seasonGrid,
        seasonCard,
        seasonPoster,
        seasonInfo,
        seasonName,
        seasonMeta,
        recommendations,
    } = styles();
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const { data: show, isLoading } = useTvDetail(id);
    const { data: recs, isLoading: recsLoading } = useRecommendations("tv", id);

    if (isLoading || !show) {
        return <div className={page()} />;
    }

    const filteredSeasons =
        show.seasons?.filter((s) => s.season_number > 0) ?? [];

    return (
        <div className={page()}>
            <div
                className={backdrop()}
                style={{
                    backgroundImage: `url(${getBackdropUrl(show.backdrop_path)})`,
                }}
            >
                <div className={gradient()} />
            </div>

            <div className={container()}>
                <div className={header()}>
                    <img
                        src={getPosterUrl(show.poster_path, "w500")}
                        alt={getTitle(show)}
                        className={poster()}
                    />
                    <div className={info()}>
                        <h1 className={title()}>{getTitle(show)}</h1>
                        <div className={meta()}>
                            {show.first_air_date && (
                                <span className={metaItem()}>
                                    <Icon
                                        icon="mdi:calendar"
                                        className="size-4"
                                    />
                                    {new Date(
                                        show.first_air_date,
                                    ).getFullYear()}
                                </span>
                            )}
                            <span className={metaItem()}>
                                <Icon
                                    icon="mdi:folder-multiple"
                                    className="size-4"
                                />
                                {show.number_of_seasons} Seasons
                            </span>
                            <span className={metaItem()}>
                                <Icon
                                    icon="mdi:star"
                                    className="size-4 text-accent"
                                />
                                {show.vote_average.toFixed(1)}
                            </span>
                        </div>
                        <div className="mt-5">
                            <Button
                                onClick={() =>
                                    navigate({
                                        to: "/tv/$id/$season/$episode",
                                        params: {
                                            id,
                                            season: "1",
                                            episode: "1",
                                        },
                                    })
                                }
                            >
                                <Icon icon="mdi:play" className="size-5" />
                                Watch S1 E1
                            </Button>
                        </div>
                    </div>
                </div>

                <p className={overview()}>{show.overview}</p>

                <h2 className={sectionTitle()}>
                    <Icon
                        icon="mdi:folder-play"
                        className="size-5 text-accent"
                    />
                    Seasons
                </h2>
                <div className={seasonGrid()}>
                    {filteredSeasons.map((season) => (
                        <button
                            key={season.id}
                            type="button"
                            className={seasonCard()}
                            onClick={() =>
                                navigate({
                                    to: "/tv/$id/$season/$episode",
                                    params: {
                                        id,
                                        season: String(season.season_number),
                                        episode: "1",
                                    },
                                })
                            }
                        >
                            <img
                                src={getPosterUrl(season.poster_path, "w342")}
                                alt={season.name}
                                className={seasonPoster()}
                            />
                            <div className={seasonInfo()}>
                                <p className={seasonName()}>{season.name}</p>
                                <p className={seasonMeta()}>
                                    <Icon
                                        icon="mdi:movie-play"
                                        className="size-3.5"
                                    />
                                    {season.episode_count} episodes
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {(recsLoading ||
                    (recs?.results && recs.results.length > 0)) && (
                    <div className={recommendations()}>
                        <MediaRow
                            title="More Like This"
                            items={recs?.results}
                            isLoading={recsLoading}
                            mediaType="tv"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
