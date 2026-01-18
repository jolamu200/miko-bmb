import { Menu } from "@base-ui/react/menu";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { useLogout, useUser } from "~/features/auth/auth.hooks";
import { useIsMobile } from "~/hooks/useIsMobile";

const styles = tv({
    slots: {
        wrapper: "fixed z-50 left-1/2 -translate-x-1/2",
        nav: "glass-strong rounded-full px-2 py-2 flex items-center gap-1 shadow-xl shadow-black/30 ring-1 ring-white/10",
        logo: "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold bg-linear-to-r from-accent via-yellow-200 to-accent bg-clip-text text-transparent transition-all duration-300 hover:opacity-80",
        logoIcon: "size-5 text-accent",
        navItem:
            "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
        navItemIcon: "size-5",
        userButton:
            "size-9 rounded-full bg-linear-to-br from-accent/90 to-yellow-600 flex items-center justify-center text-surface font-semibold text-sm overflow-hidden ring-2 ring-white/10 hover:ring-accent/40 transition-all duration-300 cursor-pointer",
        avatar: "size-full object-cover",
        dropdown:
            "w-64 bg-surface/98 backdrop-blur-2xl border border-white/8 rounded-card shadow-2xl shadow-black/70 overflow-hidden origin-top-right transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
        dropdownHeader: "p-4 border-b border-white/6 bg-white/2",
        dropdownUserInfo: "flex items-center gap-3",
        dropdownAvatar:
            "size-11 rounded-full bg-linear-to-br from-accent to-yellow-600 flex items-center justify-center text-surface font-semibold text-sm overflow-hidden ring-2 ring-white/10",
        dropdownAvatarImg: "size-full object-cover",
        dropdownDetails: "flex-1 min-w-0",
        dropdownName: "text-sm font-semibold text-primary truncate",
        dropdownEmail: "text-xs text-muted truncate mt-0.5",
        dropdownMenu: "p-2 space-y-1",
        dropdownItem:
            "w-full px-3 py-2.5 text-left text-sm text-muted data-highlighted:bg-white/6 data-highlighted:text-primary transition-all duration-200 rounded-button flex items-center gap-3 cursor-pointer outline-none",
        dropdownItemIcon:
            "size-5 transition-transform duration-200 group-data-highlighted:scale-110",
    },
    variants: {
        active: {
            true: {
                navItem: "bg-white/10 text-primary",
            },
            false: {
                navItem: "text-muted hover:text-primary hover:bg-white/5",
            },
        },
        position: {
            top: {
                wrapper: "top-6",
            },
            bottom: {
                wrapper: "bottom-4",
            },
        },
    },
});

/** Centered pill navigation bar */
export function Navigation() {
    const isMobile = useIsMobile();

    const {
        wrapper,
        nav,
        logo,
        logoIcon,
        navItem,
        navItemIcon,
        userButton,
        avatar,
        dropdown,
        dropdownHeader,
        dropdownUserInfo,
        dropdownAvatar,
        dropdownAvatarImg,
        dropdownDetails,
        dropdownName,
        dropdownEmail,
        dropdownMenu,
        dropdownItem,
        dropdownItemIcon,
    } = styles();

    const { data: user, isLoading } = useUser();
    const logout = useLogout();
    const location = useLocation();

    const initials =
        user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?";

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={wrapper({ position: isMobile ? "bottom" : "top" })}>
            <nav className={nav()}>
                <Link to="/" className={logo()} aria-label="Miko">
                    <Icon icon="mdi:play-circle" className={logoIcon()} />
                    Miko
                </Link>

                <Link
                    to="/"
                    className={navItem({ active: isActive("/") })}
                    aria-label="Home"
                >
                    <Icon icon="mdi:home-variant" className={navItemIcon()} />
                    {!isMobile && "Home"}
                </Link>

                <Link
                    to="/search"
                    search={{ q: "" }}
                    className={navItem({ active: isActive("/search") })}
                    aria-label="Search"
                >
                    <Icon icon="mdi:magnify" className={navItemIcon()} />
                    {!isMobile && "Search"}
                </Link>

                {user && (
                    <Link
                        to="/watchlist"
                        className={navItem({ active: isActive("/watchlist") })}
                        aria-label="Watchlist"
                    >
                        <Icon
                            icon="mdi:bookmark-multiple"
                            className={navItemIcon()}
                        />
                        {!isMobile && "Watchlist"}
                    </Link>
                )}

                {!isLoading && !user && (
                    <Link
                        to="/login"
                        className={navItem({ active: isActive("/login") })}
                        aria-label="Sign In"
                    >
                        <Icon
                            icon="mdi:login-variant"
                            className={navItemIcon()}
                        />
                        {!isMobile && "Sign In"}
                    </Link>
                )}

                {user && (
                    <Menu.Root>
                        <Menu.Trigger
                            className={userButton()}
                            aria-label="User menu"
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
                        </Menu.Trigger>
                        <Menu.Portal>
                            <Menu.Positioner align="end" sideOffset={12}>
                                <Menu.Popup className={dropdown()}>
                                    <div className={dropdownHeader()}>
                                        <div className={dropdownUserInfo()}>
                                            <div className={dropdownAvatar()}>
                                                {user.photoURL ? (
                                                    <img
                                                        src={user.photoURL}
                                                        alt=""
                                                        className={dropdownAvatarImg()}
                                                    />
                                                ) : (
                                                    initials.toUpperCase()
                                                )}
                                            </div>
                                            <div className={dropdownDetails()}>
                                                <p className={dropdownName()}>
                                                    {user.displayName || "User"}
                                                </p>
                                                <p className={dropdownEmail()}>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Menu.Group className={dropdownMenu()}>
                                        <Menu.Item className={dropdownItem()}>
                                            <Icon
                                                icon="mdi:account-circle"
                                                className={dropdownItemIcon()}
                                            />
                                            Profile
                                        </Menu.Item>
                                        <Menu.Item className={dropdownItem()}>
                                            <Icon
                                                icon="mdi:cog"
                                                className={dropdownItemIcon()}
                                            />
                                            Settings
                                        </Menu.Item>
                                        <Menu.Item className={dropdownItem()}>
                                            <Icon
                                                icon="mdi:history"
                                                className={dropdownItemIcon()}
                                            />
                                            Watch History
                                        </Menu.Item>
                                        <div className="h-px bg-white/6 my-1" />
                                        <Menu.Item
                                            className={dropdownItem()}
                                            onClick={() => logout.mutate()}
                                        >
                                            <Icon
                                                icon="mdi:logout-variant"
                                                className={dropdownItemIcon()}
                                            />
                                            Sign Out
                                        </Menu.Item>
                                    </Menu.Group>
                                </Menu.Popup>
                            </Menu.Positioner>
                        </Menu.Portal>
                    </Menu.Root>
                )}
            </nav>
        </div>
    );
}
