import { Icon } from "@iconify/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { useUser } from "~/features/auth/hooks/useAuth";
import { WatchlistCard } from "~/features/watchlist/components/WatchlistCard";
import { useWatchlist } from "~/features/watchlist/hooks/useWatchlist";
import type { WatchlistItem } from "~/features/watchlist/types";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/watchlist")({
    component: WatchlistPage,
});

const styles = tv({
    slots: {
        header: "flex items-center gap-3 mb-8",
        headerIcon: "size-8 text-accent",
        title: "text-2xl font-bold",
        count: "text-sm text-muted ml-2",
        grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5",
        empty: "text-center text-muted py-16 glass rounded-3xl animate-fade-in",
        emptyIcon: "size-16 text-muted/30 mx-auto mb-4",
        loginPrompt: "text-center py-16 glass rounded-3xl animate-fade-in",
        loginIcon: "size-16 text-accent/50 mx-auto mb-4",
    },
});

function WatchlistPage() {
    const {
        header,
        headerIcon,
        title,
        count,
        grid,
        empty,
        emptyIcon,
        loginPrompt,
        loginIcon,
    } = styles();

    const { data: user, isLoading: userLoading } = useUser();
    const { data: items, isLoading } = useWatchlist();

    if (userLoading) {
        return (
            <PageLayout>
                <div className={header()}>
                    <Icon
                        icon="mdi:bookmark-multiple"
                        className={headerIcon()}
                    />
                    <h1 className={title()}>My Watchlist</h1>
                </div>
                <div className={empty()}>
                    <Icon
                        icon="mdi:loading"
                        className="size-8 animate-spin mx-auto"
                    />
                </div>
            </PageLayout>
        );
    }

    if (!user) {
        return (
            <PageLayout>
                <div className={header()}>
                    <Icon
                        icon="mdi:bookmark-multiple"
                        className={headerIcon()}
                    />
                    <h1 className={title()}>My Watchlist</h1>
                </div>
                <div className={loginPrompt()}>
                    <Icon icon="mdi:account-lock" className={loginIcon()} />
                    <p className="text-muted mb-4">
                        Sign in to save movies and shows to your watchlist
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
                    >
                        <Icon icon="mdi:login" className="size-5" />
                        Sign In
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className={header()}>
                <Icon icon="mdi:bookmark-multiple" className={headerIcon()} />
                <h1 className={title()}>My Watchlist</h1>
                {items?.length ? (
                    <span className={count()}>
                        ({items.length}{" "}
                        {items.length === 1 ? "title" : "titles"})
                    </span>
                ) : null}
            </div>

            {isLoading ? (
                <div className={empty()}>
                    <Icon
                        icon="mdi:loading"
                        className="size-8 animate-spin mx-auto"
                    />
                </div>
            ) : !items?.length ? (
                <div className={empty()}>
                    <Icon
                        icon="mdi:bookmark-off-outline"
                        className={emptyIcon()}
                    />
                    <p className="mb-2">Your watchlist is empty</p>
                    <p className="text-sm">
                        Browse and add some titles to get started!
                    </p>
                </div>
            ) : (
                <div className={grid()}>
                    {items.map((item: WatchlistItem) => (
                        <WatchlistCard
                            key={`${item.mediaType}-${item.id}`}
                            item={item}
                        />
                    ))}
                </div>
            )}
        </PageLayout>
    );
}
