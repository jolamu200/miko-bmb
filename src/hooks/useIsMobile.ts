import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/** Hook to detect mobile viewport */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined"
            ? window.innerWidth < MOBILE_BREAKPOINT
            : false,
    );

    useEffect(() => {
        const query = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
        );

        const handleChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        setIsMobile(query.matches);
        query.addEventListener("change", handleChange);
        return () => query.removeEventListener("change", handleChange);
    }, []);

    return isMobile;
}
