import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors",
        icon: "size-5",
    },
});

type TextLinkProps = {
    to: string;
    icon?: string;
    children: React.ReactNode;
};

/** Accent-colored text link with optional icon */
export function TextLink({ to, icon, children }: TextLinkProps) {
    const s = styles();
    return (
        <Link to={to} className={s.root()}>
            {icon && <Icon icon={icon} className={s.icon()} />}
            {children}
        </Link>
    );
}
