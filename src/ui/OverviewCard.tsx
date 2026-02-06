import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    base: "text-muted leading-relaxed glass rounded-card p-5 mt-3",
    variants: {
        animate: {
            true: "animate-fade-up",
        },
    },
});

type OverviewCardProps = VariantProps<typeof styles> & {
    children: React.ReactNode;
    windowTitle: string;
};

/** Glass card for displaying media overview/description text */
export function OverviewCard({
    children,
    animate,
    windowTitle,
}: OverviewCardProps) {
    return (
        <>
            <p className={styles({ animate })}>{children}</p>
            <title>{windowTitle}</title>
        </>
    );
}
