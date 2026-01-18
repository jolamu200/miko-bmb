import {
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useUser } from "~/features/auth/hooks/useAuth";
import type { MediaItem } from "~/features/browse/types";
import type { HistoryItem } from "../types";

const api = ofetch.create({ baseURL: "/api/history" });

/** Fetch user's watch history */
export function useHistory() {
    const { data: user } = useUser();

    return useQuery({
        queryKey: ["history"],
        queryFn: () => api<HistoryItem[]>("/"),
        enabled: !!user,
    });
}

/** Add item to watch history */
export function useAddToHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: Omit<HistoryItem, "watchedAt">) =>
            api<HistoryItem>("/", { method: "POST", body: item }),
        onSuccess: (newItem) => {
            queryClient.setQueryData<HistoryItem[]>(["history"], (old) => {
                const filtered =
                    old?.filter(
                        (h) =>
                            !(
                                h.mediaType === newItem.mediaType &&
                                h.id === newItem.id
                            ),
                    ) ?? [];
                return [newItem, ...filtered];
            });
        },
    });
}

/** Remove item from watch history */
export function useRemoveFromHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            mediaType,
            id,
        }: {
            mediaType: "movie" | "tv";
            id: number;
        }) => api(`/${mediaType}/${id}`, { method: "DELETE" }),
        onSuccess: (_, { mediaType, id }) => {
            queryClient.setQueryData<HistoryItem[]>(["history"], (old) =>
                old?.filter(
                    (item) => !(item.mediaType === mediaType && item.id === id),
                ),
            );
        },
    });
}

/** Track viewing history - call in route components with route params */
export function useTrackHistory(
    mediaType: "movie" | "tv",
    id: string,
    season?: number,
    episode?: number,
) {
    const { data: user } = useUser();
    const queryClient = useQueryClient();
    const { mutate } = useAddToHistory();

    // Use query key per unique params - staleTime: Infinity ensures queryFn
    const params = `${mediaType}-${id}-${season}-${episode}`;
    useQuery({
        queryKey: ["track-history", params],
        queryFn: () => {
            // Skip if this exact item (same id + season + episode) already exists
            // in history - no need to track again.
            const history = queryClient.getQueryData<HistoryItem[]>([
                "history",
            ]);
            const alreadyTracked = history?.some(
                (h) =>
                    h.mediaType === mediaType &&
                    h.id === Number(id) &&
                    h.season === season &&
                    h.episode === episode,
            );

            if (!alreadyTracked) {
                mutate({
                    id: Number(id),
                    mediaType,
                    ...(season !== undefined && { season }),
                    ...(episode !== undefined && { episode }),
                });
            }
            return null;
        },
        enabled: !!user,
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: 0,
    });
}

const tmdbApi = ofetch.create({ baseURL: "/api/tmdb" });

export type ContinueWatchingItem = MediaItem & {
    season?: number;
    episode?: number;
};

/** Fetch continue watching items with full TMDB details */
export function useContinueWatching(limit = 10) {
    const { data: history } = useHistory();
    const items = history?.slice(0, limit) ?? [];

    const queries = useQueries({
        queries: items.map((item) => ({
            queryKey: ["tmdb", item.mediaType, String(item.id)],
            queryFn: () => tmdbApi<MediaItem>(`/${item.mediaType}/${item.id}`),
            staleTime: 1000 * 60 * 30,
        })),
    });

    const isLoading = queries.some((q) => q.isLoading);
    const data: ContinueWatchingItem[] = queries
        .map((q, i) => {
            if (!q.data) return null;
            return {
                ...q.data,
                media_type: items[i].mediaType,
                season: items[i].season,
                episode: items[i].episode,
            } as ContinueWatchingItem;
        })
        .filter((item): item is ContinueWatchingItem => item !== null);

    return { data: data.length > 0 ? data : undefined, isLoading };
}
