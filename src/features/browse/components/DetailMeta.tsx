import { MediaMeta } from "~/ui/MediaMeta";
import type { MovieDetail, TvDetail } from "../types";

type DetailMetaProps =
    | { media: MovieDetail; type: "movie" }
    | { media: TvDetail; type: "tv" };

/** Unified meta display for movie and TV detail pages */
export function DetailMeta({ media, type }: DetailMetaProps) {
    const items = [
        getYearItem(media, type),
        type === "movie"
            ? getRuntimeItem(media as MovieDetail)
            : getSeasonsItem(media as TvDetail),
        getRatingItem(media),
        getGenresItem(media),
    ].filter(Boolean) as { icon: string; label: string; highlight?: boolean }[];

    return <MediaMeta items={items} animate />;
}

function getYearItem(media: MovieDetail | TvDetail, type: "movie" | "tv") {
    const date =
        type === "movie"
            ? (media as MovieDetail).release_date
            : (media as TvDetail).first_air_date;
    if (!date) return null;
    return {
        icon: "mdi:calendar",
        label: new Date(date).getFullYear().toString(),
    };
}

function getRuntimeItem(movie: MovieDetail) {
    if (!movie.runtime) return null;
    return {
        icon: "mdi:clock-outline",
        label: `${movie.runtime} min`,
    };
}

function getSeasonsItem(show: TvDetail) {
    return {
        icon: "mdi:folder-multiple",
        label: `${show.number_of_seasons} Seasons`,
    };
}

function getRatingItem(media: MovieDetail | TvDetail) {
    if (!media.vote_average) return null;
    return {
        icon: "mdi:star",
        label: media.vote_average.toFixed(1),
        highlight: true,
    };
}

function getGenresItem(media: MovieDetail | TvDetail) {
    if (!media.genres?.length) return null;
    return {
        icon: "mdi:tag-multiple",
        label: media.genres.map((g) => g.name).join(", "),
    };
}
