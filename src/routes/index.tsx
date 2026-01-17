import { createFileRoute } from "@tanstack/react-router";
import {
    MediaRow,
    usePopularMovies,
    useTopRatedTv,
    useTrending,
} from "~/features/browse";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    const trending = useTrending("all", "day");
    const popularMovies = usePopularMovies();
    const topRatedTv = useTopRatedTv();

    return (
        <PageLayout spacing="md">
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
