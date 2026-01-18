import { createFileRoute } from "@tanstack/react-router";
import { MediaRow } from "~/features/browse/components/MediaRow";
import {
    useMovieDetail,
    useRecommendations,
} from "~/features/browse/hooks/useTmdb";
import { useTrackHistory } from "~/features/history/hooks/useHistory";
import { Player } from "~/features/stream/components/Player";
import { PlayerHeader } from "~/features/stream/components/PlayerHeader";
import { MediaMeta } from "~/ui/MediaMeta";
import { OverviewCard } from "~/ui/OverviewCard";
import { PageLayout } from "~/ui/PageLayout";
import { Skeleton } from "~/ui/Skeleton";
import { Stack } from "~/ui/Stack";

export const Route = createFileRoute("/movie/$id")({
    component: MoviePage,
});

function MoviePage() {
    const { id } = Route.useParams();
    useTrackHistory("movie", id);
    const { data: movie, isLoading } = useMovieDetail(id);
    const {
        data: recs,
        isLoading: recsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useRecommendations("movie", id);

    if (isLoading || !movie) {
        return (
            <PageLayout maxWidth="md">
                <Stack>
                    <Skeleton variant="title" />
                    <Skeleton variant="video" />
                </Stack>
            </PageLayout>
        );
    }

    const metaItems = [
        movie.release_date && {
            icon: "mdi:calendar",
            label: new Date(movie.release_date).getFullYear().toString(),
        },
        movie.runtime && {
            icon: "mdi:clock-outline",
            label: `${movie.runtime} min`,
        },
        movie.vote_average && {
            icon: "mdi:star",
            label: movie.vote_average.toFixed(1),
            highlight: true,
        },
        movie.genres?.length > 0 && {
            icon: "mdi:tag-multiple",
            label: movie.genres.map((g) => g.name).join(", "),
        },
    ].filter(Boolean) as { icon: string; label: string; highlight?: boolean }[];

    return (
        <PageLayout maxWidth="md">
            <Stack>
                <div>
                    <PlayerHeader title={movie.title ?? "Movie"} backHref="/" />
                    <Player mediaType="movie" tmdbId={id} />
                </div>
                <OverviewCard animate>{movie.overview}</OverviewCard>
                <MediaMeta items={metaItems} animate />
            </Stack>

            {(recsLoading || (recs?.pages[0]?.results?.length ?? 0) > 0) && (
                <Stack gap="xl">
                    <MediaRow
                        title="More Like This"
                        items={recs?.pages.flatMap((p) => p.results)}
                        isLoading={recsLoading || isFetchingNextPage}
                        mediaType="movie"
                        onLoadMore={fetchNextPage}
                        hasMore={hasNextPage}
                    />
                </Stack>
            )}
        </PageLayout>
    );
}
