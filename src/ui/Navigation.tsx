import { Menu } from "@base-ui/react/menu";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { useLogout, useUser } from "~/features/auth/auth.hooks";
import type { User } from "~/features/auth/types";
import { useIsMobile } from "~/hooks/useIsMobile";
import { Button } from "./Button";

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
            "ml-2 size-9 rounded-full bg-linear-to-br from-accent/90 to-yellow-600 flex items-center justify-center text-surface font-semibold text-sm overflow-hidden ring-2 ring-white/10 hover:ring-accent/40 transition-all duration-300 cursor-pointer",
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

function Logo() {
    const { logo, logoIcon } = styles();

    return (
        <Link to="/" className={logo()} aria-label="Miko">
            <Icon icon="mdi:play-circle" className={logoIcon()} />
            Miko
        </Link>
    );
}

function NavLink({
    to,
    icon,
    label,
    search,
}: {
    to: string;
    icon: string;
    label: string;
    search?: Record<string, string>;
}) {
    const isMobile = useIsMobile();
    const location = useLocation();
    const { navItem, navItemIcon } = styles();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            search={search}
            className={navItem({ active })}
            aria-label={label}
        >
            <Icon icon={icon} className={navItemIcon()} />
            {!isMobile && label}
        </Link>
    );
}

function UserAvatar({ user, size = "sm" }: { user: User; size?: "sm" | "lg" }) {
    const { userButton, avatar, dropdownAvatar, dropdownAvatarImg } = styles();
    const initials =
        user.displayName?.charAt(0) || user.email?.charAt(0) || "?";

    if (size === "lg") {
        return (
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
        );
    }

    return (
        <Menu.Trigger className={userButton()} aria-label="User menu">
            {user.photoURL ? (
                <img src={user.photoURL} alt="" className={avatar()} />
            ) : (
                initials.toUpperCase()
            )}
        </Menu.Trigger>
    );
}

function UserMenuDropdown({ user }: { user: User }) {
    const navigate = useNavigate();
    const logout = useLogout();
    const {
        dropdown,
        dropdownHeader,
        dropdownUserInfo,
        dropdownDetails,
        dropdownName,
        dropdownEmail,
        dropdownMenu,
        dropdownItem,
        dropdownItemIcon,
    } = styles();

    return (
        <Menu.Portal>
            <Menu.Positioner align="end" sideOffset={12}>
                <Menu.Popup className={dropdown()}>
                    <div className={dropdownHeader()}>
                        <div className={dropdownUserInfo()}>
                            <UserAvatar user={user} size="lg" />
                            <div className={dropdownDetails()}>
                                <p className={dropdownName()}>
                                    {user.displayName || "User"}
                                </p>
                                <p className={dropdownEmail()}>{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <Menu.Group className={dropdownMenu()}>
                        <Menu.Item
                            className={dropdownItem()}
                            onClick={() => navigate({ to: "/profile" })}
                        >
                            <Icon
                                icon="mdi:account-circle"
                                className={dropdownItemIcon()}
                            />
                            Profile & Settings
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
    );
}

function UserMenu({ user }: { user: User }) {
    return (
        <Menu.Root>
            <UserAvatar user={user} />
            <UserMenuDropdown user={user} />
        </Menu.Root>
    );
}

function UserPresenter({
    loading,
    user,
}: {
    loading: boolean;
    user: User | undefined;
}) {
    if (loading) return <Button icon="eos-icons:hourglass">Wait</Button>;
    if (!user)
        return <NavLink to="/login" icon="mdi:login-variant" label="Sign In" />;

    return <UserMenu user={user} />;
}

/** Centered pill navigation bar */
export function Navigation() {
    const isMobile = useIsMobile();
    const { data: user, isLoading } = useUser();
    const { wrapper, nav } = styles();

    return (
        <div className={wrapper({ position: isMobile ? "bottom" : "top" })}>
            <nav className={nav()}>
                <Logo />
                <NavLink to="/" icon="mdi:home-variant" label="Home" />
                <NavLink
                    to="/search"
                    icon="mdi:magnify"
                    label="Search"
                    search={{ q: "" }}
                />
                {user && (
                    <NavLink
                        to="/watchlist"
                        icon="mdi:bookmark-multiple"
                        label="Watchlist"
                    />
                )}
                <UserPresenter loading={isLoading} user={user} />
            </nav>
        </div>
    );
}
