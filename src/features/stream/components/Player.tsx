import { tv } from "tailwind-variants";
import { streamer } from "../stream-lib";

const styles = tv({
    slots: {
        root: "relative w-full aspect-video bg-black rounded-card",
        iframe: "absolute inset-0 w-full h-full border-0 rounded-card",
    },
});

type PlayerProps = {
    mediaType: "movie" | "tv";
    tmdbId: string;
    season?: number;
    episode?: number;
};

/** Video player wrapper for vidsrc embeds */
export function Player({ mediaType, tmdbId, season, episode }: PlayerProps) {
    const { root, iframe } = styles();
    const src =
        mediaType === "movie"
            ? streamer.url.movie(tmdbId)
            : streamer.url.series(tmdbId, season ?? 1, episode ?? 1);

    return (
        <div className={root()}>
            <iframe
                src={src}
                className={iframe()}
                title="Video Player"
                allowFullScreen
            />
        </div>
    );
}
