import { createFileRoute } from "@tanstack/react-router";
import { useSeasonDetail, useTvDetail } from "~/features/browse/hooks/useTmdb";
import { getTitle } from "~/features/browse/types";
import { useTrackHistory } from "~/features/history/hooks/useHistory";
import { EpisodeSelector } from "~/features/stream/components/EpisodeSelector";
import { Player } from "~/features/stream/components/Player";
import { PlayerHeader } from "~/features/stream/components/PlayerHeader";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/tv/$id/$season/$episode")({
    component: TvEpisodePage,
});

function TvEpisodePage() {
    const { id, season, episode } = Route.useParams();
    const seasonNum = parseInt(season, 10);
    const episodeNum = parseInt(episode, 10);

    useTrackHistory("tv", id, seasonNum, episodeNum);

    const { data: show } = useTvDetail(id);
    const { data: seasonData } = useSeasonDetail(id, seasonNum);

    const showTitle = show ? getTitle(show) : "Loading...";
    const currentEpisode = seasonData?.episodes?.find(
        (e) => e.episode_number === episodeNum,
    );
    const subtitle = currentEpisode
        ? `S${seasonNum} E${episodeNum} - ${currentEpisode.name}`
        : `S${seasonNum} E${episodeNum}`;

    return (
        <PageLayout maxWidth="md">
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
                    currentSeason={seasonNum}
                    currentEpisode={episodeNum}
                />
            )}
        </PageLayout>
    );
}
