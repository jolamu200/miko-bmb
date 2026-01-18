import { useQueries } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import type { MediaItem, TmdbListResponse } from "~/features/browse/types";
import { useHistory } from "./useHistory";

const api = ofetch.create({ baseURL: "/api/tmdb" });

/** Personalized recommendations based on 3 most recent history items */
export function useForYou() {
    const { data: history = [], isLoading: historyLoading } = useHistory();

    // Get 3 most recent unique items by id+mediaType
    const sourceKeys = new Set<string>();

    for (const h of history) {
        const key = `${h.mediaType}+=+${h.id}`;
        sourceKeys.add(key);
        if (sourceKeys.size === 3) break;
    }

    //Get recommendations for each from TMDB
    const queries = useQueries({
        queries: [...sourceKeys].map((key) => {
            const [mediaType, id] = key.split("+=+");
            return {
                queryKey: ["tmdb", mediaType, id, "recommendations"],
                queryFn: () =>
                    api<TmdbListResponse<MediaItem>>(
                        `/${mediaType}/${id}/recommendations`,
                    ),
                staleTime: 1000 * 60 * 10,
            };
        }),
    });

    const isLoading = historyLoading || queries.some((q) => q.isLoading);

    // Dedupe set - start with watched items, add recommendations as we pick them
    const flat = queries.flatMap((query) => query.data?.results ?? []);
    const items = [...flat]
        .filter((it) => !history.some((h) => it.id === h.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
    return { data: items, isLoading, hasHistory: history.length > 0 };
}
