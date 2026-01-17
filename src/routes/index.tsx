import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "~/features/auth";
import {
    MediaRow,
    usePopularMovies,
    useTopRatedTv,
    useTrending,
} from "~/features/browse";
import {
    useForYou,
    useHistory,
    useRemoveFromHistory,
} from "~/features/history";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    const { data: user } = useUser();
    const { data: history } = useHistory();
    const { data: forYouItems, isLoading: forYouLoading } = useForYou();
    const removeFromHistory = useRemoveFromHistory();
    const trending = useTrending("all", "day");
    const popularMovies = usePopularMovies();
    const topRatedTv = useTopRatedTv();

    // Convert history items to MediaItem format for MediaRow
    const continueWatchingItems = history?.slice(0, 10).map((item) => ({
        id: item.id,
        title: item.mediaType === "movie" ? item.title : undefined,
        name: item.mediaType === "tv" ? item.title : undefined,
        poster_path: item.posterPath,
        backdrop_path: null,
        overview: "",
        vote_average: 0,
        media_type: item.mediaType as "movie" | "tv",
        genre_ids: [],
    }));

    return (
        <PageLayout spacing="md">
            {user &&
                continueWatchingItems &&
                continueWatchingItems.length > 0 && (
                    <MediaRow
                        title="Continue Watching"
                        items={continueWatchingItems}
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
