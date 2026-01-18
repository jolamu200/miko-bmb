import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    base: "relative overflow-hidden bg-surface-raised after:absolute after:inset-0 after:bg-linear-to-r after:from-transparent after:via-white/5 after:to-transparent after:animate-shimmer",
    variants: {
        variant: {
            card: "aspect-2/3 rounded-card ring-1 ring-white/5",
            video: "aspect-video rounded-card",
            title: "h-8 w-48 rounded",
            text: "h-4 rounded",
            circle: "rounded-full",
        },
    },
    defaultVariants: {
        variant: "text",
    },
});

type SkeletonProps = VariantProps<typeof styles>;

/** Loading placeholder */
export function Skeleton({ variant }: SkeletonProps) {
    return <div className={styles({ variant })} />;
}
