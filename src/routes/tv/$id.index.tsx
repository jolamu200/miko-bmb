import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MediaRow } from "~/features/browse/components/MediaRow";
import { SeasonCard } from "~/features/browse/components/SeasonCard";
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
import { CardGrid } from "~/ui/CardGrid";
import { HeroLayout } from "~/ui/HeroLayout";
import { MediaHeader } from "~/ui/MediaHeader";
import { MediaMeta } from "~/ui/MediaMeta";
import { OverviewCard } from "~/ui/OverviewCard";
import { SectionHeader } from "~/ui/SectionHeader";
import { Stack } from "~/ui/Stack";

export const Route = createFileRoute("/tv/$id/")({
    component: TvShowPage,
});

function TvShowPage() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const { data: show, isLoading } = useTvDetail(id);
    const {
        data: recs,
        isLoading: recsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useRecommendations("tv", id);

    if (isLoading || !show) {
        return <HeroLayout />;
    }

    const filteredSeasons =
        show.seasons?.filter((s) => s.season_number > 0) ?? [];

    const metaItems = [
        show.first_air_date && {
            icon: "mdi:calendar",
            label: new Date(show.first_air_date).getFullYear().toString(),
        },
        {
            icon: "mdi:folder-multiple",
            label: `${show.number_of_seasons} Seasons`,
        },
        show.vote_average && {
            icon: "mdi:star",
            label: show.vote_average.toFixed(1),
            highlight: true,
        },
    ].filter(Boolean) as { icon: string; label: string; highlight?: boolean }[];

    return (
        <HeroLayout backdropUrl={getBackdropUrl(show.backdrop_path)}>
            <Stack gap="lg">
                <MediaHeader
                    posterUrl={getPosterUrl(show.poster_path, "w500")}
                    title={getTitle(show)}
                    meta={<MediaMeta items={metaItems} />}
                    actions={
                        <Button
                            icon="mdi:play"
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
                            Watch S1 E1
                        </Button>
                    }
                />

                <OverviewCard>{show.overview}</OverviewCard>

                <SectionHeader
                    icon="mdi:folder-play"
                    title="Seasons"
                    content={
                        <CardGrid columns="seasons">
                            {filteredSeasons.map((season) => (
                                <SeasonCard
                                    key={season.id}
                                    tvId={id}
                                    seasonNumber={season.season_number}
                                    name={season.name}
                                    episodeCount={season.episode_count}
                                    posterPath={season.poster_path}
                                />
                            ))}
                        </CardGrid>
                    }
                />

                {(recsLoading ||
                    (recs?.pages[0]?.results?.length ?? 0) > 0) && (
                    <MediaRow
                        title="More Like This"
                        items={recs?.pages.flatMap((p) => p.results)}
                        isLoading={recsLoading || isFetchingNextPage}
                        mediaType="tv"
                        onLoadMore={fetchNextPage}
                        hasMore={hasNextPage}
                    />
                )}
            </Stack>
        </HeroLayout>
    );
}
