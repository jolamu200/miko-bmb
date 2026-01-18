import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    base: "flex flex-col",
    variants: {
        gap: {
            sm: "gap-4",
            md: "gap-6",
            lg: "gap-10",
            xl: "gap-12",
        },
    },
    defaultVariants: {
        gap: "md",
    },
});

type StackProps = VariantProps<typeof styles> & {
    children: React.ReactNode;
};

/** Vertical stack with consistent spacing between children */
export function Stack({ children, gap }: StackProps) {
    return <div className={styles({ gap })}>{children}</div>;
}
