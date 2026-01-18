import { Tooltip } from "@base-ui/react/tooltip";
import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";
import { useUser } from "~/features/auth/auth.hooks";
import {
    useAddToWatchlist,
    useInWatchlist,
    useRemoveFromWatchlist,
} from "../watchlist.hooks";

const styles = tv({
    slots: {
        button: "p-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95",
        icon: "size-4 transition-transform duration-300",
        tooltip:
            "px-2.5 py-1.5 text-xs font-medium bg-neutral-900 text-primary rounded-button shadow-xl shadow-black/60 border border-white/10 animate-fade-in",
    },
    variants: {
        inWatchlist: {
            true: {
                button: "bg-linear-to-br from-accent to-yellow-600 text-surface shadow-lg shadow-accent/30",
                icon: "animate-icon-bounce",
            },
            false: {
                button: "bg-black/50 text-muted hover:text-primary hover:bg-black/70 ring-1 ring-white/10",
                icon: "",
            },
        },
    },
});

type WatchlistButtonProps = {
    id: number;
    mediaType: "movie" | "tv";
};

/** Button to add/remove item from watchlist */
export function WatchlistButton({ id, mediaType }: WatchlistButtonProps) {
    const { data: user } = useUser();
    const { inWatchlist } = useInWatchlist(mediaType, id);
    const addToWatchlist = useAddToWatchlist();
    const removeFromWatchlist = useRemoveFromWatchlist();

    // Don't show if not logged in
    if (!user) return null;

    const isLoading = addToWatchlist.isPending || removeFromWatchlist.isPending;
    const s = styles({ inWatchlist });
    const tooltipText = inWatchlist
        ? "Remove from watchlist"
        : "Add to watchlist";

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (inWatchlist) {
            removeFromWatchlist.mutate({ mediaType, id });
        } else {
            addToWatchlist.mutate({ id, mediaType });
        }
    }

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger
                    render={
                        <button
                            type="button"
                            className={s.button()}
                            onClick={handleClick}
                            disabled={isLoading}
                            aria-label={tooltipText}
                        >
                            <Icon
                                icon={
                                    inWatchlist
                                        ? "mdi:bookmark-check"
                                        : "mdi:bookmark-plus-outline"
                                }
                                className={s.icon()}
                            />
                        </button>
                    }
                />
                <Tooltip.Portal>
                    <Tooltip.Positioner sideOffset={8}>
                        <Tooltip.Popup className={s.tooltip()}>
                            {tooltipText}
                        </Tooltip.Popup>
                    </Tooltip.Positioner>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
