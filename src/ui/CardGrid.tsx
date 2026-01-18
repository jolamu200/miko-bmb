import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    base: "grid gap-5 mt-4",
    variants: {
        columns: {
            media: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
            seasons: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
        },
    },
    defaultVariants: {
        columns: "media",
    },
});

type CardGridProps = VariantProps<typeof styles> & {
    children: React.ReactNode;
};

/** Responsive grid layout for cards */
export function CardGrid({ children, columns }: CardGridProps) {
    return <div className={styles({ columns })}>{children}</div>;
}
