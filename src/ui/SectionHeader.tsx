import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "",
        header: "flex items-center gap-2.5 px-1 mb-4",
        icon: "size-5 text-accent",
        title: "text-lg font-semibold text-primary",
        info: "text-sm text-muted ml-1",
        contentSlot: "mt-4",
    },
});

type SectionHeaderProps = {
    icon: string;
    title: string;
    info?: React.ReactNode;
    content?: React.ReactNode;
};

/** Consistent section header with icon and title */
export function SectionHeader({
    icon,
    title,
    info,
    content,
}: SectionHeaderProps) {
    const s = styles();

    if (!content) {
        return (
            <div className={s.header()}>
                <Icon icon={icon} className={s.icon()} />
                <h2 className={s.title()}>{title}</h2>
                {info && <span className={s.info()}>{info}</span>}
            </div>
        );
    }

    return (
        <section className={s.root()}>
            <div className={s.header()}>
                <Icon icon={icon} className={s.icon()} />
                <h2 className={s.title()}>{title}</h2>
                {info && <span className={s.info()}>{info}</span>}
            </div>
            <div className={s.contentSlot()}>{content}</div>
        </section>
    );
}
