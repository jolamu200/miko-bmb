import { tv, type VariantProps } from "tailwind-variants";

const skeleton = tv({
    base: "animate-pulse bg-surface-raised",
    variants: {
        variant: {
            card: "aspect-[2/3] rounded-card",
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
