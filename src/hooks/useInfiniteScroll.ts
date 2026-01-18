import { type RefObject, useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading?: boolean;
    rootMargin?: string;
    rootRef?: RefObject<Element | null>;
};

/** Hook for infinite scroll using IntersectionObserver */
export function useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading = false,
    rootMargin = "200px",
    rootRef,
}: UseInfiniteScrollOptions) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || !hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onLoadMore();
                }
            },
            { rootMargin, root: rootRef?.current ?? null },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore, rootMargin, rootRef]);

    return sentinelRef;
}
