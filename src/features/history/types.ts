export type HistoryItem = {
    id: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath: string | null;
    watchedAt: number;
    season?: number;
    episode?: number;
};
