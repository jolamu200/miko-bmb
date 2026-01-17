import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";
import { useUser } from "~/features/auth";
import {
    useAddToWatchlist,
    useInWatchlist,
    useRemoveFromWatchlist,
} from "../hooks/useWatchlist";

const styles = tv({
    slots: {
        button: "p-2 rounded-full transition-colors",
    },
    variants: {
        inWatchlist: {
            true: { button: "bg-accent text-primary" },
            false: {
                button: "bg-surface-raised/80 text-muted hover:text-primary",
            },
        },
    },
});

type WatchlistButtonProps = {
    id: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath: string | null;
};

/** Button to add/remove item from watchlist */
export function WatchlistButton({
    id,
    mediaType,
    title,
    posterPath,
}: WatchlistButtonProps) {
    const { button } = styles();
    const { data: user } = useUser();
    const { data } = useInWatchlist(mediaType, id);
    const addToWatchlist = useAddToWatchlist();
    const removeFromWatchlist = useRemoveFromWatchlist();

    // Don't show if not logged in
    if (!user) return null;

    const inWatchlist = data?.inWatchlist ?? false;
    const isLoading = addToWatchlist.isPending || removeFromWatchlist.isPending;

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (inWatchlist) {
            removeFromWatchlist.mutate({ mediaType, id });
        } else {
            addToWatchlist.mutate({ id, mediaType, title, posterPath });
        }
    }

    return (
        <button
            type="button"
            className={button({ inWatchlist })}
            onClick={handleClick}
            disabled={isLoading}
        >
            <Icon
                icon={inWatchlist ? "mdi:bookmark" : "mdi:bookmark-outline"}
                className="size-5"
            />
        </button>
    );
}
