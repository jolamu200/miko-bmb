import { createFileRoute } from "@tanstack/react-router";
import {
    useMovieDetail,
    useRecommendations,
} from "~/features/browse/browse.hooks";
import { DetailMeta } from "~/features/browse/components/DetailMeta";
import { MediaRow } from "~/features/browse/components/MediaRow";
import { useTrackHistory } from "~/features/history/history.hooks";
import { Player } from "~/features/stream/components/Player";
import { PlayerHeader } from "~/features/stream/components/PlayerHeader";
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

    return (
        <PageLayout maxWidth="md" spacing="md">
            <Stack>
                <div>
                    <PlayerHeader title={movie.title ?? "Movie"} backHref="/" />
                    <Player mediaType="movie" tmdbId={id} />
                </div>
                <OverviewCard windowTitle={movie.title as string} animate>
                    {movie.overview}
                </OverviewCard>
                <DetailMeta media={movie} type="movie" />
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
