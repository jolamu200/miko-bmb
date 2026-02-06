import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "relative w-full aspect-video bg-black rounded-card ring-1 ring-white/8 shadow-2xl shadow-black/60 overflow-hidden animate-fade-in",
        iframe: "absolute inset-0 w-full h-full border-0",
    },
});

type PlayerProps = {
    mediaType: "movie" | "tv";
    tmdbId: string;
    season?: number;
    episode?: number;
};

/** Video player iframe wrapper */
export function Player({ mediaType, tmdbId, season, episode }: PlayerProps) {
    const { root, iframe } = styles();

    const src =
        mediaType === "movie"
            ? `https://vidsrc-embed.ru/embed/movie?tmdb=${tmdbId}`
            : `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

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
