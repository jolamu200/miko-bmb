import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { Button } from "~/ui/Button";

const styles = tv({
    slots: {
        root: "flex items-center justify-between py-4",
        left: "flex items-center gap-4",
        title: "text-lg font-medium text-primary",
        subtitle: "text-sm text-muted",
        actions: "flex items-center gap-2",
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
    const { root, left, title, subtitle, actions } = styles();

    return (
        <div className={root()}>
            <div className={left()}>
                <Link to={backHref}>
                    <Button variant="ghost" size="sm">
                        <Icon icon="mdi:arrow-left" className="size-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className={title()}>{playerTitle}</h1>
                    {playerSubtitle && (
                        <p className={subtitle()}>{playerSubtitle}</p>
                    )}
                </div>
            </div>
            <div className={actions()}>
                <Button variant="ghost" size="sm">
                    <Icon icon="mdi:bookmark-outline" className="size-5" />
                </Button>
            </div>
        </div>
    );
}
