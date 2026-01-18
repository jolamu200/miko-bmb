import { Icon } from "@iconify/react";
import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "flex flex-wrap gap-5 text-sm text-muted",
        item: "flex items-center gap-1.5",
        icon: "size-4",
    },
    variants: {
        animate: {
            true: { root: "animate-fade-in" },
        },
    },
});

type MetaItem = {
    icon: string;
    label: string;
    highlight?: boolean;
};

type MediaMetaProps = VariantProps<typeof styles> & {
    items: MetaItem[];
};

/** Displays a row of metadata items with icons */
export function MediaMeta({ items, animate }: MediaMetaProps) {
    const s = styles({ animate });
    return (
        <div className={s.root()}>
            {items.map((item) => (
                <span key={item.label} className={s.item()}>
                    <Icon
                        icon={item.icon}
                        className={`${s.icon()} ${item.highlight ? "text-accent" : ""}`}
                    />
                    {item.label}
                </span>
            ))}
        </div>
    );
}
