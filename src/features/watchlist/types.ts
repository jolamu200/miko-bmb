export type WatchlistItem = {
    id: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath: string | null;
    addedAt: number;
};
