import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        page: "min-h-screen text-primary",
        backdrop: "relative h-64 md:h-96 bg-cover bg-center",
        gradient:
            "absolute inset-0 bg-linear-to-t from-surface via-surface/80 to-surface/20",
        container:
            "max-w-5xl mx-auto px-4 pb-8 -mt-32 relative z-10 animate-fade-up",
    },
});

type HeroLayoutProps = {
    backdropUrl?: string;
    children?: React.ReactNode;
};

/** Full-page hero layout with backdrop image and gradient overlay */
export function HeroLayout({ backdropUrl, children }: HeroLayoutProps) {
    const s = styles();

    return (
        <div className={s.page()}>
            <div
                className={s.backdrop()}
                style={
                    backdropUrl
                        ? { backgroundImage: `url(${backdropUrl})` }
                        : undefined
                }
            >
                <div className={s.gradient()} />
            </div>
            <div className={s.container()}>{children}</div>
        </div>
    );
}
