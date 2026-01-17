import { Icon } from "@iconify/react";
import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "text-center py-16 glass rounded-3xl animate-fade-in",
        iconWrapper: "mx-auto mb-4",
        icon: "size-16 text-muted/30",
        title: "text-primary font-medium mb-2",
        subtitle: "text-sm text-muted",
        action: "mt-4",
    },
    variants: {
        size: {
            sm: { root: "py-8", icon: "size-10" },
            md: { root: "py-16", icon: "size-16" },
        },
    },
    defaultVariants: {
        size: "md",
    },
});

type EmptyStateProps = VariantProps<typeof styles> & {
    icon: string;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
};

/** Empty state placeholder with icon, text, and optional action */
export function EmptyState({
    icon,
    title,
    subtitle,
    action,
    size,
}: EmptyStateProps) {
    const s = styles({ size });

    return (
        <div className={s.root()}>
            <div className={s.iconWrapper()}>
                <Icon icon={icon} className={s.icon()} />
            </div>
            <p className={s.title()}>{title}</p>
            {subtitle && <p className={s.subtitle()}>{subtitle}</p>}
            {action && <div className={s.action()}>{action}</div>}
        </div>
    );
}
