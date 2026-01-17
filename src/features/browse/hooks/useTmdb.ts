import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import type {
    MediaItem,
    MovieDetail,
    SeasonDetail,
    TmdbListResponse,
    TvDetail,
} from "../types";

const api = ofetch.create({ baseURL: "/api/tmdb" });

export function useTrending(
    mediaType: "all" | "movie" | "tv" = "all",
    timeWindow: "day" | "week" = "day",
) {
    return useQuery({
        queryKey: ["tmdb", "trending", mediaType, timeWindow],
        queryFn: () =>
            api<TmdbListResponse<MediaItem>>(
                `/trending/${mediaType}/${timeWindow}`,
            ),
    });
}

export function usePopularMovies(page = 1) {
    return useQuery({
        queryKey: ["tmdb", "movie", "popular", page],
        queryFn: () =>
            api<TmdbListResponse<MediaItem>>("/movie/popular", {
                query: { page },
            }),
    });
}

export function useTopRatedTv(page = 1) {
    return useQuery({
        queryKey: ["tmdb", "tv", "top_rated", page],
        queryFn: () =>
            api<TmdbListResponse<MediaItem>>("/tv/top_rated", {
                query: { page },
            }),
    });
}

export function useMovieDetail(id: string) {
    return useQuery({
        queryKey: ["tmdb", "movie", id],
        queryFn: () => api<MovieDetail>(`/movie/${id}`),
        enabled: !!id,
    });
}

export function useTvDetail(id: string) {
    return useQuery({
        queryKey: ["tmdb", "tv", id],
        queryFn: () => api<TvDetail>(`/tv/${id}`),
        enabled: !!id,
    });
}

export function useSeasonDetail(tvId: string, seasonNumber: number) {
    return useQuery({
        queryKey: ["tmdb", "tv", tvId, "season", seasonNumber],
        queryFn: () => api<SeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`),
        enabled: !!tvId && seasonNumber >= 0,
        // Keep previous data while fetching to prevent layout shift
        placeholderData: (prev) => prev,
    });
}

export function useSearch(query: string) {
    return useQuery({
        queryKey: ["tmdb", "search", query],
        queryFn: () =>
            api<TmdbListResponse<MediaItem>>("/search/multi", {
                query: { query },
            }),
        enabled: query.length >= 2,
    });
}

export function useRecommendations(mediaType: "movie" | "tv", id: string) {
    return useQuery({
        queryKey: ["tmdb", mediaType, id, "recommendations"],
        queryFn: () =>
            api<TmdbListResponse<MediaItem>>(
                `/${mediaType}/${id}/recommendations`,
            ),
        enabled: !!id,
    });
}

export function useDiscover(mediaType: "movie" | "tv", genreId?: number) {
    return useQuery({
        queryKey: ["tmdb", "discover", mediaType, genreId],
        queryFn: () =>
            api<TmdbListResponse<MediaItem>>(`/discover/${mediaType}`, {
                query: genreId ? { with_genres: genreId } : {},
            }),
    });
}
