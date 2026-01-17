import { createFileRoute } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { useMovieDetail } from "~/features/browse";
import { Player, PlayerHeader } from "~/features/stream";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/movie/$id")({
    component: MoviePage,
});

const styles = tv({
    slots: {
        overview: "mt-6 text-muted leading-relaxed",
        meta: "flex gap-4 mt-4 text-sm text-muted",
    },
});

function MoviePage() {
    const { overview, meta } = styles();
    const { id } = Route.useParams();
    const { data: movie, isLoading } = useMovieDetail(id);

    if (isLoading || !movie) {
        return (
            <PageLayout maxWidth="md" padding="bottom">
                <div className="h-8 w-48 bg-surface-raised animate-pulse rounded mt-4" />
                <div className="aspect-video bg-surface-raised animate-pulse rounded-card mt-4" />
            </PageLayout>
        );
    }

    return (
        <PageLayout maxWidth="md" padding="bottom">
            <PlayerHeader title={movie.title ?? "Movie"} backHref="/" />
            <Player mediaType="movie" tmdbId={id} />
            <p className={overview()}>{movie.overview}</p>
            <div className={meta()}>
                {movie.release_date && (
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                )}
                {movie.runtime && <span>{movie.runtime} min</span>}
                {movie.genres?.map((g) => g.name).join(", ")}
            </div>
        </PageLayout>
    );
}
