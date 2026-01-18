export type MediaType = "movie" | "tv";

export type MediaItem = {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: MediaType;
    genre_ids: number[];
};

export type MovieDetail = MediaItem & {
    runtime: number;
    genres: { id: number; name: string }[];
    tagline: string;
};

export type TvDetail = MediaItem & {
    number_of_seasons: number;
    number_of_episodes: number;
    seasons: Season[];
    genres: { id: number; name: string }[];
};

export type Season = {
    id: number;
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
};

export type Episode = {
    id: number;
    episode_number: number;
    season_number: number;
    name: string;
    overview: string;
    still_path: string | null;
    runtime: number;
};

export type SeasonDetail = {
    episodes: Episode[];
};

export type TmdbListResponse<T> = {
    results: T[];
    page: number;
    total_pages: number;
    total_results: number;
};

export function getTitle(item: MediaItem): string {
    return item.title || item.name || "Unknown";
}

export function getReleaseYear(item: MediaItem): string {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear().toString() : "";
}

export function getPosterUrl(
    path: string | null,
    size: "w185" | "w342" | "w500" = "w342",
): string {
    if (!path)
        return "https://placehold.co/342x513/141414/808080?text=No+Poster";
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(
    path: string | null,
    size: "w780" | "w1280" | "original" = "w1280",
): string {
    if (!path)
        return "https://placehold.co/1280x720/141414/808080?text=No+Image";
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getStillUrl(
    path: string | null,
    size: "w185" | "w300" | "original" = "w300",
): string {
    if (!path)
        return "https://placehold.co/300x169/141414/808080?text=No+Image";
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
