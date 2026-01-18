import { tv, type VariantProps } from "tailwind-variants";

const skeleton = tv({
    base: "relative overflow-hidden bg-surface-raised after:absolute after:inset-0 after:bg-linear-to-r after:from-transparent after:via-white/5 after:to-transparent after:animate-shimmer",
    variants: {
        variant: {
            card: "aspect-2/3 rounded-3xl ring-1 ring-white/5",
            text: "h-4 rounded",
            circle: "rounded-full",
        },
    },
    defaultVariants: {
        variant: "text",
    },
});

type SkeletonProps = VariantProps<typeof skeleton> & {
    className?: string;
};

/** Loading placeholder */
export function Skeleton({ variant, className }: SkeletonProps) {
    return <div className={skeleton({ variant, className })} />;
}
