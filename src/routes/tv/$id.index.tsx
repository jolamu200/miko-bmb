import { Icon } from "@iconify/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import {
    getBackdropUrl,
    getPosterUrl,
    getTitle,
    useTvDetail,
} from "~/features/browse";
import { Button } from "~/ui/Button";

export const Route = createFileRoute("/tv/$id/")({
    component: TvShowPage,
});

const styles = tv({
    slots: {
        page: "min-h-screen bg-surface text-primary",
        backdrop: "relative h-64 md:h-96 bg-cover bg-center",
        gradient:
            "absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent",
        container: "max-w-5xl mx-auto px-4 pb-8 -mt-32 relative z-10",
        header: "flex gap-6",
        poster: "w-32 md:w-48 rounded-card shadow-lg flex-shrink-0",
        info: "flex flex-col justify-end",
        title: "text-2xl md:text-3xl font-bold",
        meta: "flex gap-4 mt-2 text-sm text-muted",
        overview: "mt-6 text-muted leading-relaxed",
        seasonGrid: "mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
        seasonCard:
            "bg-surface-raised rounded-card overflow-hidden hover:bg-surface-overlay transition-colors cursor-pointer",
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
        overview,
        seasonGrid,
        seasonCard,
    } = styles();
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const { data: show, isLoading } = useTvDetail(id);

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
                                <span>
                                    {new Date(
                                        show.first_air_date,
                                    ).getFullYear()}
                                </span>
                            )}
                            <span>{show.number_of_seasons} Seasons</span>
                            <span className="flex items-center gap-1">
                                <Icon
                                    icon="mdi:star"
                                    className="text-yellow-500"
                                />
                                {show.vote_average.toFixed(1)}
                            </span>
                        </div>
                        <div className="mt-4">
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
                                <Icon icon="mdi:play" className="size-5 mr-2" />
                                Watch S1 E1
                            </Button>
                        </div>
                    </div>
                </div>

                <p className={overview()}>{show.overview}</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">Seasons</h2>
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
                                className="w-full aspect-[2/3] object-cover"
                            />
                            <div className="p-3 text-left">
                                <p className="font-medium text-sm">
                                    {season.name}
                                </p>
                                <p className="text-xs text-muted">
                                    {season.episode_count} episodes
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
