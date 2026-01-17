import { useQueries } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import type { MediaItem, TmdbListResponse } from "~/features/browse/types";
import { useHistory } from "./useHistory";

const api = ofetch.create({ baseURL: "/api/tmdb" });

/**
 * Personalized recommendations from recent watch history.
 * Fetches TMDB recommendations for last 3 unique items, merges and dedupes.
 */
export function useForYou() {
    const { data: history, isLoading: historyLoading } = useHistory();

    // Get 3 most recent unique items
    const sources = getUniqueSources(history ?? [], 3);

    // Fetch recommendations in parallel
    const queries = useQueries({
        queries: sources.map((item) => ({
            queryKey: ["tmdb", item.mediaType, item.id, "recommendations"],
            queryFn: () =>
                api<TmdbListResponse<MediaItem>>(
                    `/${item.mediaType}/${item.id}/recommendations`,
                ),
            staleTime: 1000 * 60 * 10,
        })),
    });

    const isLoading = historyLoading || queries.some((q) => q.isLoading);

    // Build exclusion set (already watched + source items)
    const exclude = new Set(
        (history ?? []).map((h) => `${h.mediaType}-${h.id}`),
    );
    for (const s of sources) exclude.add(`${s.mediaType}-${s.id}`);

    // Merge results: interleave from each source, dedupe, take top 20
    const seen = new Set<string>();
    const items: MediaItem[] = [];
    const lists = queries.map((q) => q.data?.results ?? []);
    const maxLen = Math.max(...lists.map((l) => l.length), 0);

    for (let i = 0; i < maxLen && items.length < 20; i++) {
        for (const list of lists) {
            if (i >= list.length || items.length >= 20) continue;
            const item = list[i];
            const key = `${item.media_type}-${item.id}`;
            if (!exclude.has(key) && !seen.has(key)) {
                seen.add(key);
                items.push(item);
            }
        }
    }

    return { data: items, isLoading, hasHistory: (history?.length ?? 0) > 0 };
}

function getUniqueSources(
    history: Array<{ id: number; mediaType: string }>,
    limit: number,
) {
    const seen = new Set<string>();
    const result: Array<{ id: number; mediaType: "movie" | "tv" }> = [];

    for (const item of history) {
        const key = `${item.mediaType}-${item.id}`;
        if (!seen.has(key)) {
            seen.add(key);
            result.push({
                id: item.id,
                mediaType: item.mediaType as "movie" | "tv",
            });
            if (result.length >= limit) break;
        }
    }
    return result;
}
