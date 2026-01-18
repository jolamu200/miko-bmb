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

const tmdbApi = ofetch.create({ baseURL: "/api/tmdb" });

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
    const data: MediaItem[] = queries
        .map((q, i) => {
            if (!q.data) return null;
            return {
                ...q.data,
                media_type: items[i].mediaType,
            } as MediaItem;
        })
        .filter((item): item is MediaItem => item !== null);

    return { data: data.length > 0 ? data : undefined, isLoading };
}
