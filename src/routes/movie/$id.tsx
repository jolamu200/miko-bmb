import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import {
    MediaRow,
    useMovieDetail,
    useRecommendations,
} from "~/features/browse";
import { Player, PlayerHeader } from "~/features/stream";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/movie/$id")({
    component: MoviePage,
});

const styles = tv({
    slots: {
        overview:
            "mt-6 text-muted leading-relaxed glass rounded-card p-5 animate-fade-up",
        meta: "flex flex-wrap gap-5 mt-5 text-sm text-muted animate-fade-in",
        metaItem: "flex items-center gap-1.5",
        recommendations: "mt-12",
    },
});

function MoviePage() {
    const { overview, meta, metaItem, recommendations } = styles();
    const { id } = Route.useParams();
    const { data: movie, isLoading } = useMovieDetail(id);
    const { data: recs, isLoading: recsLoading } = useRecommendations(
        "movie",
        id,
    );

    if (isLoading || !movie) {
        return (
            <PageLayout maxWidth="md" padding="bottom">
                <div className="h-8 w-48 bg-surface-raised animate-shimmer rounded mt-4" />
                <div className="aspect-video bg-surface-raised animate-shimmer rounded-card mt-4" />
            </PageLayout>
        );
    }

    return (
        <PageLayout maxWidth="md" padding="bottom">
            <PlayerHeader title={movie.title ?? "Movie"} backHref="/" />
            <Player
                mediaType="movie"
                tmdbId={id}
                title={movie.title ?? "Movie"}
                posterPath={movie.poster_path}
            />
            <p className={overview()}>{movie.overview}</p>
            <div className={meta()}>
                {movie.release_date && (
                    <span className={metaItem()}>
                        <Icon icon="mdi:calendar" className="size-4" />
                        {new Date(movie.release_date).getFullYear()}
                    </span>
                )}
                {movie.runtime && (
                    <span className={metaItem()}>
                        <Icon icon="mdi:clock-outline" className="size-4" />
                        {movie.runtime} min
                    </span>
                )}
                {movie.vote_average && (
                    <span className={metaItem()}>
                        <Icon icon="mdi:star" className="size-4 text-accent" />
                        {movie.vote_average.toFixed(1)}
                    </span>
                )}
                {movie.genres?.length > 0 && (
                    <span className={metaItem()}>
                        <Icon icon="mdi:tag-multiple" className="size-4" />
                        {movie.genres.map((g) => g.name).join(", ")}
                    </span>
                )}
            </div>

            {(recsLoading || (recs?.results && recs.results.length > 0)) && (
                <div className={recommendations()}>
                    <MediaRow
                        title="More Like This"
                        items={recs?.results}
                        isLoading={recsLoading}
                        mediaType="movie"
                    />
                </div>
            )}
        </PageLayout>
    );
}
