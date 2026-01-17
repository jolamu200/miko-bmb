import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useUser } from "~/features/auth";
import type { WatchlistItem } from "../types";

const api = ofetch.create({ baseURL: "/api/watchlist" });

/** Fetch user's watchlist */
export function useWatchlist() {
    const { data: user } = useUser();

    return useQuery({
        queryKey: ["watchlist"],
        queryFn: () => api<WatchlistItem[]>("/"),
        retry: false,
        enabled: !!user,
    });
}

/** Check if item is in watchlist (uses cached watchlist data) */
export function useInWatchlist(mediaType: "movie" | "tv", id: number) {
    const { data: watchlist } = useWatchlist();

    const inWatchlist =
        watchlist?.some(
            (item) => item.mediaType === mediaType && item.id === id,
        ) ?? false;

    return { data: { inWatchlist }, isLoading: false };
}

/** Add item to watchlist */
export function useAddToWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: Omit<WatchlistItem, "addedAt">) =>
            api("/", { method: "POST", body: item }),
        onSuccess: (_, item) => {
            // Optimistically add to cached watchlist
            queryClient.setQueryData<WatchlistItem[]>(["watchlist"], (old) => [
                { ...item, addedAt: Date.now() },
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
            // Optimistically remove from cached watchlist
            queryClient.setQueryData<WatchlistItem[]>(["watchlist"], (old) =>
                old?.filter(
                    (item) => !(item.mediaType === mediaType && item.id === id),
                ),
            );
        },
    });
}
