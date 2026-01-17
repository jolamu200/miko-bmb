import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { useLogout, useUser } from "~/features/auth";

const styles = tv({
    slots: {
        nav: "fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border",
        container:
            "max-w-7xl mx-auto px-4 h-14 flex items-center justify-between",
        logo: "text-xl font-bold text-accent",
        links: "flex items-center gap-4",
        link: "text-muted hover:text-primary transition-colors flex items-center gap-1",
        userButton:
            "relative size-8 rounded-full bg-accent flex items-center justify-center text-primary font-medium overflow-hidden",
        avatar: "size-full object-cover",
        dropdown:
            "absolute top-full right-0 mt-2 w-48 bg-surface-raised rounded-card shadow-lg border border-border overflow-hidden",
        dropdownItem:
            "w-full px-4 py-2 text-left text-sm hover:bg-surface-overlay transition-colors",
        dropdownEmail:
            "px-4 py-2 text-xs text-muted border-b border-border truncate",
    },
});

/** Top navigation bar */
export function Navigation() {
    const {
        nav,
        container,
        logo,
        links,
        link,
        userButton,
        avatar,
        dropdown,
        dropdownItem,
        dropdownEmail,
    } = styles();

    const { data: user, isLoading } = useUser();
    const logout = useLogout();
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        logout.mutate();
        setMenuOpen(false);
    }

    const initials =
        user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?";

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

                    {user && (
                        <Link to="/watchlist" className={link()}>
                            <Icon
                                icon="mdi:bookmark-outline"
                                className="size-5"
                            />
                            Watchlist
                        </Link>
                    )}

                    {!isLoading && !user && (
                        <Link to="/login" className={link()}>
                            <Icon icon="mdi:account" className="size-5" />
                            Sign In
                        </Link>
                    )}

                    {user && (
                        <div className="relative">
                            <button
                                type="button"
                                className={userButton()}
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt=""
                                        className={avatar()}
                                    />
                                ) : (
                                    initials.toUpperCase()
                                )}
                            </button>

                            {menuOpen && (
                                <div className={dropdown()}>
                                    <div className={dropdownEmail()}>
                                        {user.email}
                                    </div>
                                    <button
                                        type="button"
                                        className={dropdownItem()}
                                        onClick={handleLogout}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
