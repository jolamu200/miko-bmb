import { Icon } from "@iconify/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { useUser } from "~/features/auth";
import { getPosterUrl } from "~/features/browse";
import {
    useRemoveFromWatchlist,
    useWatchlist,
    type WatchlistItem,
} from "~/features/watchlist";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/watchlist")({
    component: WatchlistPage,
});

const styles = tv({
    slots: {
        title: "text-2xl font-bold mb-6",
        grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
        card: "group relative overflow-hidden rounded-card bg-surface-raised",
        poster: "aspect-2/3 w-full object-cover",
        removeButton:
            "absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity",
        info: "p-3",
        itemTitle: "text-sm font-medium line-clamp-1",
        itemMeta: "text-xs text-muted mt-1",
        empty: "text-center text-muted py-12",
        loginPrompt: "text-center py-12",
    },
});

function WatchlistPage() {
    const {
        title,
        grid,
        card,
        poster,
        removeButton,
        info,
        itemTitle,
        itemMeta,
        empty,
        loginPrompt,
    } = styles();

    const { data: user, isLoading: userLoading } = useUser();
    const { data: items, isLoading } = useWatchlist();
    const removeFromWatchlist = useRemoveFromWatchlist();

    if (userLoading) {
        return (
            <PageLayout>
                <h1 className={title()}>My Watchlist</h1>
                <div className={empty()}>Loading...</div>
            </PageLayout>
        );
    }

    if (!user) {
        return (
            <PageLayout>
                <h1 className={title()}>My Watchlist</h1>
                <div className={loginPrompt()}>
                    <p className="text-muted mb-4">
                        Sign in to save movies and shows to your watchlist
                    </p>
                    <Link to="/login" className="text-accent hover:underline">
                        Sign In
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <h1 className={title()}>My Watchlist</h1>

            {isLoading ? (
                <div className={empty()}>Loading...</div>
            ) : !items?.length ? (
                <div className={empty()}>
                    Your watchlist is empty. Browse and add some titles!
                </div>
            ) : (
                <div className={grid()}>
                    {items.map((item: WatchlistItem) => (
                        <div
                            key={`${item.mediaType}-${item.id}`}
                            className={card()}
                        >
                            <Link
                                to={
                                    item.mediaType === "movie"
                                        ? "/movie/$id"
                                        : "/tv/$id"
                                }
                                params={{ id: String(item.id) }}
                            >
                                <img
                                    src={getPosterUrl(item.posterPath)}
                                    alt={item.title}
                                    className={poster()}
                                    loading="lazy"
                                />
                            </Link>
                            <button
                                type="button"
                                className={removeButton()}
                                onClick={() =>
                                    removeFromWatchlist.mutate({
                                        mediaType: item.mediaType,
                                        id: item.id,
                                    })
                                }
                            >
                                <Icon icon="mdi:close" className="size-4" />
                            </button>
                            <div className={info()}>
                                <p className={itemTitle()}>{item.title}</p>
                                <p className={itemMeta()}>
                                    {item.mediaType === "movie"
                                        ? "Movie"
                                        : "TV Show"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    );
}
