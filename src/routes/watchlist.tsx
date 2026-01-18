import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "~/features/auth/auth.hooks";
import { MediaRow } from "~/features/browse/components/MediaRow";
import {
    useContinueWatching,
    useRemoveFromHistory,
} from "~/features/history/history.hooks";
import { WatchlistCard } from "~/features/watchlist/components/WatchlistCard";
import type { WatchlistItem } from "~/features/watchlist/types";
import { useWatchlist } from "~/features/watchlist/watchlist.hooks";
import { CardGrid } from "~/ui/CardGrid";
import { EmptyState } from "~/ui/EmptyState";
import { PageLayout } from "~/ui/PageLayout";
import { SectionHeader } from "~/ui/SectionHeader";
import { TextLink } from "~/ui/TextLink";

export const Route = createFileRoute("/watchlist")({
    component: WatchlistPage,
});

function WatchlistPage() {
    const { data: user, isLoading: userLoading } = useUser();
    const { data: items, isLoading } = useWatchlist();
    const { data: continueWatching, isLoading: continueWatchingLoading } =
        useContinueWatching();
    const removeFromHistory = useRemoveFromHistory();

    const countInfo = items?.length
        ? `(${items.length} ${items.length === 1 ? "title" : "titles"})`
        : undefined;

    if (userLoading) {
        return (
            <PageLayout>
                <SectionHeader
                    icon="mdi:bookmark-multiple"
                    title="My Watchlist"
                />
                <EmptyState icon="eos-icons:loading" title="Loading..." />
            </PageLayout>
        );
    }

    if (!user) {
        return (
            <PageLayout>
                <SectionHeader
                    icon="mdi:bookmark-multiple"
                    title="My Watchlist"
                />
                <EmptyState
                    icon="mdi:account-lock"
                    title="Sign in to access your watchlist"
                    subtitle="Save movies and shows to watch later"
                    action={
                        <TextLink to="/login" icon="mdi:login">
                            Sign In
                        </TextLink>
                    }
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout spacing="md">
            {(continueWatchingLoading ||
                (continueWatching && continueWatching.length > 0)) && (
                <MediaRow
                    title="Continue Watching"
                    items={continueWatching}
                    isLoading={continueWatchingLoading}
                    onRemove={(item) =>
                        removeFromHistory.mutate({
                            mediaType: item.media_type ?? "movie",
                            id: item.id,
                        })
                    }
                />
            )}

            <section>
                <SectionHeader
                    icon="mdi:bookmark-multiple"
                    title="My Watchlist"
                    info={countInfo}
                />

                {isLoading ? (
                    <EmptyState icon="eos-icons:loading" title="Loading..." />
                ) : !items?.length ? (
                    <EmptyState
                        icon="mdi:bookmark-off-outline"
                        title="Your watchlist is empty"
                        subtitle="Browse and add some titles to get started!"
                    />
                ) : (
                    <CardGrid>
                        {items.map((item: WatchlistItem) => (
                            <WatchlistCard
                                key={`${item.mediaType}-${item.id}`}
                                item={item}
                            />
                        ))}
                    </CardGrid>
                )}
            </section>
        </PageLayout>
    );
}
