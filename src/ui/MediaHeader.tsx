import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "flex gap-6",
        poster: "w-32 md:w-48 rounded-card shadow-2xl ring-1 ring-white/10 shrink-0 hover:scale-105 transition-transform duration-500",
        info: "flex flex-col justify-end",
        title: "text-2xl md:text-3xl font-bold",
        meta: "mt-3",
        actions: "mt-5",
    },
});

type MediaHeaderProps = {
    posterUrl: string;
    title: string;
    posterAlt?: string;
    meta?: React.ReactNode;
    actions?: React.ReactNode;
};

/** Header layout with poster image and media info */
export function MediaHeader({
    posterUrl,
    title,
    posterAlt,
    meta,
    actions,
}: MediaHeaderProps) {
    const s = styles();

    return (
        <div className={s.root()}>
            <img
                src={posterUrl}
                alt={posterAlt ?? title}
                className={s.poster()}
            />
            <div className={s.info()}>
                <h1 className={s.title()}>{title}</h1>
                {meta && <div className={s.meta()}>{meta}</div>}
                {actions && <div className={s.actions()}>{actions}</div>}
            </div>
        </div>
    );
}
