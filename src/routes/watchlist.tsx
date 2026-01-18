import { createFileRoute } from "@tanstack/react-router";
import { MediaRow } from "~/features/browse/components/MediaRow";
import {
    useContinueWatching,
    useRemoveFromHistory,
} from "~/features/history/history.hooks";
import { WatchlistCard } from "~/features/watchlist/components/WatchlistCard";
import type { WatchlistItem } from "~/features/watchlist/types";
import { useWatchlist } from "~/features/watchlist/watchlist.hooks";
import { AuthGuard } from "~/ui/AuthGuard";
import { CardGrid } from "~/ui/CardGrid";
import { EmptyState } from "~/ui/EmptyState";
import { PageLayout } from "~/ui/PageLayout";
import { SectionHeader } from "~/ui/SectionHeader";

export const Route = createFileRoute("/watchlist")({
    component: () => (
        <AuthGuard>
            <WatchlistPage />
        </AuthGuard>
    ),
});

function ContinueWatchingSection() {
    const { data: continueWatching, isLoading } = useContinueWatching();
    const removeFromHistory = useRemoveFromHistory();

    if (!isLoading && (!continueWatching || continueWatching.length === 0)) {
        return null;
    }

    return (
        <MediaRow
            title="Continue Watching"
            items={continueWatching}
            isLoading={isLoading}
            onRemove={(item) =>
                removeFromHistory.mutate({
                    mediaType: item.media_type ?? "movie",
                    id: item.id,
                })
            }
        />
    );
}

function WatchlistSection() {
    const { data: items, isLoading } = useWatchlist();

    const countInfo = items?.length
        ? `(${items.length} ${items.length === 1 ? "title" : "titles"})`
        : undefined;

    return (
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
    );
}

function WatchlistPage() {
    return (
        <PageLayout spacing="md">
            <ContinueWatchingSection />
            <WatchlistSection />
        </PageLayout>
    );
}
