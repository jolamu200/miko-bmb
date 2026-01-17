import { Menu } from "@base-ui/react/menu";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { useLogout, useUser } from "~/features/auth/hooks/useAuth";

const styles = tv({
    slots: {
        nav: "fixed top-0 left-0 right-0 z-50 glass-strong animate-fade-in",
        container:
            "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between",
        logo: "text-xl font-bold bg-gradient-to-r from-accent via-yellow-200 to-accent bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition-opacity duration-300",
        logoIcon: "size-6 text-accent",
        links: "flex items-center gap-5",
        link: "text-muted hover:text-primary transition-all duration-300 flex items-center gap-2 text-sm group relative py-2",
        linkIcon:
            "size-5 transition-transform duration-300 group-hover:scale-110",
        linkUnderline:
            "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-transparent transition-all duration-300 group-hover:w-full",
        userButton:
            "size-10 rounded-full bg-gradient-to-br from-accent/90 to-yellow-600 flex items-center justify-center text-surface font-semibold overflow-hidden ring-2 ring-white/5 hover:ring-accent/40 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg shadow-accent/20",
        avatar: "size-full object-cover",
        dropdown:
            "w-64 bg-surface/98 backdrop-blur-2xl border border-white/8 rounded-card shadow-2xl shadow-black/70 overflow-hidden origin-top-right transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        dropdownHeader: "p-4 border-b border-white/6 bg-white/2",
        dropdownUserInfo: "flex items-center gap-3",
        dropdownAvatar:
            "size-11 rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center text-surface font-semibold text-sm overflow-hidden ring-2 ring-white/10",
        dropdownAvatarImg: "size-full object-cover",
        dropdownDetails: "flex-1 min-w-0",
        dropdownName: "text-sm font-semibold text-primary truncate",
        dropdownEmail: "text-xs text-muted truncate mt-0.5",
        dropdownMenu: "p-2 space-y-1",
        dropdownItem:
            "w-full px-3 py-2.5 text-left text-sm text-muted data-[highlighted]:bg-white/6 data-[highlighted]:text-primary transition-all duration-200 rounded-button flex items-center gap-3 cursor-pointer outline-none",
        dropdownItemIcon:
            "size-5 transition-transform duration-200 group-data-[highlighted]:scale-110",
    },
});

/** Top navigation bar */
export function Navigation() {
    const {
        nav,
        container,
        logo,
        logoIcon,
        links,
        link,
        linkIcon,
        linkUnderline,
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

    const initials =
        user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?";

    return (
        <nav className={nav()}>
            <div className={container()}>
                <Link to="/" className={logo()}>
                    <Icon icon="mdi:play-circle" className={logoIcon()} />
                    Miko
                </Link>
                <div className={links()}>
                    <Link to="/" className={link()}>
                        <Icon icon="mdi:home-variant" className={linkIcon()} />
                        Home
                        <span className={linkUnderline()} />
                    </Link>

                    <Link to="/search" className={link()}>
                        <Icon icon="mdi:magnify" className={linkIcon()} />
                        Search
                        <span className={linkUnderline()} />
                    </Link>

                    {user && (
                        <Link to="/watchlist" className={link()}>
                            <Icon
                                icon="mdi:bookmark-multiple"
                                className={linkIcon()}
                            />
                            Watchlist
                            <span className={linkUnderline()} />
                        </Link>
                    )}

                    {!isLoading && !user && (
                        <Link to="/login" className={link()}>
                            <Icon
                                icon="mdi:login-variant"
                                className={linkIcon()}
                            />
                            Sign In
                            <span className={linkUnderline()} />
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
                                                <div
                                                    className={dropdownAvatar()}
                                                >
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
                                                <div
                                                    className={dropdownDetails()}
                                                >
                                                    <p
                                                        className={dropdownName()}
                                                    >
                                                        {user.displayName ||
                                                            "User"}
                                                    </p>
                                                    <p
                                                        className={dropdownEmail()}
                                                    >
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Menu.Group className={dropdownMenu()}>
                                            <Menu.Item
                                                className={dropdownItem()}
                                            >
                                                <Icon
                                                    icon="mdi:account-circle"
                                                    className={dropdownItemIcon()}
                                                />
                                                Profile
                                            </Menu.Item>
                                            <Menu.Item
                                                className={dropdownItem()}
                                            >
                                                <Icon
                                                    icon="mdi:cog"
                                                    className={dropdownItemIcon()}
                                                />
                                                Settings
                                            </Menu.Item>
                                            <Menu.Item
                                                className={dropdownItem()}
                                            >
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
                </div>
            </div>
        </nav>
    );
}
