export const streamer = {
    /**
     * Get vidsrc url for movie or tv
     */
    url: {
        movie: (id: string) => `https://vidsrc.xyz/embed/movie/${id}`,
        series: (id: string, season: number, episode: number) =>
            `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
    },
};
