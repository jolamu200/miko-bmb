export type HistoryItem = {
    id: number;
    mediaType: "movie" | "tv";
    watchedAt: number;
    season?: number;
    episode?: number;
};
