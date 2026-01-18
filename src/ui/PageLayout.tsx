import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    slots: {
        page: "min-h-screen text-primary",
        container: "mx-auto px-4 sm:px-6",
    },
    variants: {
        maxWidth: {
            md: { container: "max-w-5xl" },
            lg: { container: "max-w-7xl" },
        },
        padding: {
            default: { container: "pt-20 pb-20" },
            none: { container: "" },
        },
        spacing: {
            none: {},
            md: { container: "space-y-8" },
        },
    },
    defaultVariants: {
        maxWidth: "lg",
        padding: "default",
        spacing: "none",
    },
});

type PageLayoutProps = VariantProps<typeof styles> & {
    children: React.ReactNode;
};

/** Standard page wrapper with surface background and centered container */
export function PageLayout({
    children,
    maxWidth,
    padding,
    spacing,
}: PageLayoutProps) {
    const { page, container } = styles({ maxWidth, padding, spacing });
    return (
        <div className={page()}>
            <div className={container()}>{children}</div>
        </div>
    );
}
