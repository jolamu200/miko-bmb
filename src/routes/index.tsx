import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "~/features/auth/auth.hooks";
import {
    usePopularMovies,
    useTopRatedTv,
    useTrending,
} from "~/features/browse/browse.hooks";
import { MediaRow } from "~/features/browse/components/MediaRow";
import {
    useContinueWatching,
    useRemoveFromHistory,
} from "~/features/history/history.hooks";
import { useForYou } from "~/features/personalisation/personalisation.hooks";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    const { data: user } = useUser();
    const { data: continueWatching, isLoading: continueWatchingLoading } =
        useContinueWatching();
    const { data: forYouItems, isLoading: forYouLoading } = useForYou();
    const removeFromHistory = useRemoveFromHistory();
    const trending = useTrending("all", "day");
    const popularMovies = usePopularMovies();
    const topRatedTv = useTopRatedTv();

    return (
        <PageLayout spacing="md">
            {user &&
                (continueWatchingLoading ||
                    (continueWatching && continueWatching.length > 0)) && (
                    <MediaRow
                        title="Continue Watching"
                        items={continueWatching}
                        isLoading={continueWatchingLoading}
                        onRemove={(item) =>
                            removeFromHistory.mutate({
                                mediaType: item.media_type ?? "movie",
                                id: item.id,
                            })
                        }
                    />
                )}

            {user &&
                (forYouLoading || (forYouItems && forYouItems.length > 0)) && (
                    <MediaRow
                        title="For You"
                        items={forYouItems}
                        isLoading={forYouLoading}
                    />
                )}

            <MediaRow
                title="Trending Today"
                items={trending.data?.results}
                isLoading={trending.isLoading}
            />

            <MediaRow
                title="Popular Movies"
                items={popularMovies.data?.results}
                isLoading={popularMovies.isLoading}
                mediaType="movie"
            />

            <MediaRow
                title="Top Rated TV"
                items={topRatedTv.data?.results}
                isLoading={topRatedTv.isLoading}
                mediaType="tv"
            />
        </PageLayout>
    );
}
