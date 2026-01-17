import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useUser } from "~/features/auth/hooks/useAuth";
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
