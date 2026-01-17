import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getTitle, useSeasonDetail, useTvDetail } from "~/features/browse";
import { EpisodeSelector, Player, PlayerHeader } from "~/features/stream";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/tv/$id/$season/$episode")({
    component: TvEpisodePage,
});

function TvEpisodePage() {
    const { id, season, episode } = Route.useParams();
    const seasonNum = parseInt(season, 10);
    const episodeNum = parseInt(episode, 10);

    const [selectedSeason, setSelectedSeason] = useState(seasonNum);
    const { data: show } = useTvDetail(id);
    const { data: seasonData } = useSeasonDetail(id, selectedSeason);

    useEffect(() => {
        setSelectedSeason(seasonNum);
    }, [seasonNum]);

    const showTitle = show ? getTitle(show) : "Loading...";
    const currentEpisode = seasonData?.episodes?.find(
        (e) => e.episode_number === episodeNum,
    );
    const subtitle = currentEpisode
        ? `S${seasonNum} E${episodeNum} - ${currentEpisode.name}`
        : `S${seasonNum} E${episodeNum}`;

    return (
        <PageLayout maxWidth="md" padding="bottom">
            <PlayerHeader
                title={showTitle}
                subtitle={subtitle}
                backHref={`/tv/${id}`}
            />
            <Player
                mediaType="tv"
                tmdbId={id}
                season={seasonNum}
                episode={episodeNum}
            />

            {show?.seasons && seasonData?.episodes && (
                <EpisodeSelector
                    tvId={id}
                    seasons={show.seasons}
                    episodes={seasonData.episodes}
                    currentSeason={selectedSeason}
                    currentEpisode={episodeNum}
                    onSeasonChange={setSelectedSeason}
                />
            )}
        </PageLayout>
    );
}
