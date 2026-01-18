import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MediaGrid } from "~/features/browse/components/MediaGrid";
import { SearchInput } from "~/features/browse/components/SearchInput";
import { useSearch } from "~/features/browse/hooks/useTmdb";
import { EmptyState } from "~/ui/EmptyState";
import { PageLayout } from "~/ui/PageLayout";
import { SectionHeader } from "~/ui/SectionHeader";

export const Route = createFileRoute("/search")({
    component: SearchPage,
    validateSearch: (search: Record<string, unknown>) => ({
        q: typeof search.q === "string" ? search.q : "",
    }),
});

function SearchPage() {
    const { q: query } = Route.useSearch();
    const navigate = useNavigate();
    const { data, isLoading } = useSearch(query);

    const setQuery = (value: string) => {
        navigate({
            to: "/search",
            search: { q: value },
            replace: true,
        });
    };

    const filteredResults = data?.results?.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv",
    );

    return (
        <PageLayout spacing="md">
            <SectionHeader
                icon="mdi:magnify"
                title="Search"
                content={
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        placeholder="Search movies and TV shows..."
                    />
                }
            />

            <section>
                {query.length < 2 ? (
                    <EmptyState
                        icon="mdi:text-search"
                        title="Start typing to search"
                        subtitle="Find movies and TV shows"
                        size="sm"
                    />
                ) : isLoading ? (
                    <MediaGrid items={undefined} isLoading />
                ) : filteredResults?.length === 0 ? (
                    <EmptyState
                        icon="mdi:movie-search-outline"
                        title={`No results for "${query}"`}
                        subtitle="Try a different search term"
                        size="sm"
                    />
                ) : (
                    <MediaGrid items={filteredResults} />
                )}
            </section>
        </PageLayout>
    );
}
