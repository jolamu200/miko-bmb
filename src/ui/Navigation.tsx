import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        nav: "fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border",
        container:
            "max-w-7xl mx-auto px-4 h-14 flex items-center justify-between",
        logo: "text-xl font-bold text-accent",
        links: "flex items-center gap-4",
        link: "text-muted hover:text-primary transition-colors flex items-center gap-1",
    },
});

/** Top navigation bar */
export function Navigation() {
    const { nav, container, logo, links, link } = styles();

    return (
        <nav className={nav()}>
            <div className={container()}>
                <Link to="/" className={logo()}>
                    Miko
                </Link>
                <div className={links()}>
                    <Link to="/search" className={link()}>
                        <Icon icon="mdi:magnify" className="size-5" />
                        Search
                    </Link>
                </div>
            </div>
        </nav>
    );
}
