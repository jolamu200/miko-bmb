import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { Button } from "~/ui/Button";

const styles = tv({
    slots: {
        root: "flex items-center justify-between py-5 animate-fade-in",
        left: "flex items-center gap-4",
        info: "space-y-1",
        title: "text-xl font-semibold text-primary flex items-center gap-2",
        subtitle: "text-sm text-muted flex items-center gap-2",
    },
});

type PlayerHeaderProps = {
    title: string;
    subtitle?: string;
    backHref: string;
};

/** Header bar above the video player */
export function PlayerHeader({
    title: playerTitle,
    subtitle: playerSubtitle,
    backHref,
}: PlayerHeaderProps) {
    const { root, left, info, title, subtitle } = styles();

    return (
        <div className={root()}>
            <div className={left()}>
                <Link to={backHref}>
                    <Button variant="secondary" size="sm">
                        <Icon icon="mdi:arrow-left" className="size-5" />
                        Back
                    </Button>
                </Link>
                <div className={info()}>
                    <h1 className={title()}>
                        <Icon
                            icon="mdi:movie-open-play"
                            className="size-5 text-accent"
                        />
                        {playerTitle}
                    </h1>
                    {playerSubtitle && (
                        <p className={subtitle()}>
                            <Icon
                                icon="mdi:television-play"
                                className="size-4"
                            />
                            {playerSubtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
