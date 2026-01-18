import { Icon } from "@iconify/react";
import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    base: "animate-spin text-muted",
    variants: {
        size: {
            sm: "size-5",
            md: "size-8",
            lg: "size-12",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

type LoadingSpinnerProps = VariantProps<typeof styles>;

/** Animated loading spinner */
export function LoadingSpinner({ size }: LoadingSpinnerProps) {
    return <Icon icon="eos-icons:loading" className={styles({ size })} />;
}
