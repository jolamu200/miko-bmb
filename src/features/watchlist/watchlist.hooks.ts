import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useUser } from "~/features/auth/auth.hooks";
import type { WatchlistItem } from "./types";

const api = ofetch.create({ baseURL: "/api/watchlist" });

/** Fetch user's watchlist */
export function useWatchlist() {
    const { data: user } = useUser();

    return useQuery({
        queryKey: ["watchlist"],
        queryFn: () => api<WatchlistItem[]>("/"),
        enabled: !!user,
    });
}

/** Check if item is in watchlist (derived from cached watchlist) */
export function useInWatchlist(mediaType: "movie" | "tv", id: number) {
    const { data: watchlist, isLoading } = useWatchlist();

    const inWatchlist =
        watchlist?.some(
            (item) => item.mediaType === mediaType && item.id === id,
        ) ?? false;

    return { inWatchlist, isLoading };
}

/** Add item to watchlist */
export function useAddToWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: Omit<WatchlistItem, "addedAt">) =>
            api<WatchlistItem>("/", { method: "POST", body: item }),
        onSuccess: (newItem) => {
            queryClient.setQueryData<WatchlistItem[]>(["watchlist"], (old) => [
                newItem,
                ...(old ?? []),
            ]);
        },
    });
}

/** Remove item from watchlist */
export function useRemoveFromWatchlist() {
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
            queryClient.setQueryData<WatchlistItem[]>(["watchlist"], (old) =>
                old?.filter(
                    (item) => !(item.mediaType === mediaType && item.id === id),
                ),
            );
        },
    });
}

/** Clear entire watchlist */
export function useClearWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api("/", { method: "DELETE" }),
        onSuccess: () => {
            queryClient.setQueryData<WatchlistItem[]>(["watchlist"], []);
        },
    });
}
