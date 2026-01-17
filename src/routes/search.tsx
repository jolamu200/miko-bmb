import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { MediaGrid, SearchInput, useSearch } from "~/features/browse";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/search")({
    component: SearchPage,
});

const styles = tv({
    slots: {
        title: "text-2xl font-bold mb-6",
        results: "mt-8",
        empty: "text-center text-muted py-12",
    },
});

function SearchPage() {
    const { title, results, empty } = styles();
    const [query, setQuery] = useState("");
    const { data, isLoading } = useSearch(query);

    const filteredResults = data?.results?.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv",
    );

    return (
        <PageLayout>
            <h1 className={title()}>Search</h1>
            <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search movies and TV shows..."
            />

            <div className={results()}>
                {query.length < 2 ? (
                    <p className={empty()}>Start typing to search...</p>
                ) : isLoading ? (
                    <MediaGrid items={undefined} isLoading />
                ) : filteredResults?.length === 0 ? (
                    <p className={empty()}>No results found for "{query}"</p>
                ) : (
                    <MediaGrid items={filteredResults} />
                )}
            </div>
        </PageLayout>
    );
}
