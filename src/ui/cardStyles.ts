import { tv } from "tailwind-variants";

/** Shared poster card styles for consistent visual treatment */
export const posterCardStyles = tv({
    slots: {
        card: "group relative overflow-hidden rounded-3xl bg-surface-raised ring-1 ring-white/5 transition-all duration-500 hover:ring-accent/50 hover:shadow-2xl hover:shadow-accent/20",
        imageWrapper: "relative aspect-2/3 overflow-hidden rounded-3xl",
        poster: "absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-110",
        shine: "absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        gradientOverlay:
            "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80",
        playButton:
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-400 shadow-2xl",
        playIcon: "size-6 ml-0.5 text-black",
        badge: "absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold",
        badgeIcon: "size-3.5",
        actionButton:
            "absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md transition-all duration-300",
        content: "absolute bottom-0 left-0 right-0 p-4",
        title: "text-sm font-semibold text-white line-clamp-1 drop-shadow-lg",
        meta: "flex items-center gap-2 text-xs text-white/70 mt-1.5",
        metaDot: "size-1 rounded-full bg-white/40",
    },
});

export type PosterCardSlots = ReturnType<typeof posterCardStyles>;
