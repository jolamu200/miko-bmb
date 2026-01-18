type PaginatedResponse = {
    page: number;
    total_pages: number;
};

/** Safely extracts next page param from paginated response */
export function getNextPage(
    lastPage: PaginatedResponse | undefined,
): number | undefined {
    if (!lastPage) return undefined;
    const { page, total_pages } = lastPage;
    if (typeof page !== "number" || typeof total_pages !== "number") {
        return undefined;
    }
    return page < total_pages ? page + 1 : undefined;
}
