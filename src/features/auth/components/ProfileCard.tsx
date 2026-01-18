import { tv } from "tailwind-variants";
import type { User } from "../types";

const styles = tv({
    slots: {
        card: "glass rounded-card p-5 space-y-4",
        header: "flex items-center gap-4",
        avatar: "size-14 rounded-full bg-linear-to-br from-accent to-yellow-600 flex items-center justify-center text-surface font-bold text-lg overflow-hidden ring-2 ring-white/10",
        avatarImg: "size-full object-cover",
        info: "flex-1 min-w-0",
        name: "text-base font-semibold text-primary truncate",
        email: "text-sm text-muted truncate",
        actions: "flex flex-wrap gap-2",
    },
});

type ProfileCardProps = {
    user: User;
    actions?: React.ReactNode;
};

/** Displays user profile information with optional actions */
export function ProfileCard({ user, actions }: ProfileCardProps) {
    const s = styles();
    const initials =
        user.displayName?.charAt(0) || user.email?.charAt(0) || "?";

    return (
        <div className={s.card()}>
            <div className={s.header()}>
                <div className={s.avatar()}>
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt=""
                            className={s.avatarImg()}
                        />
                    ) : (
                        initials.toUpperCase()
                    )}
                </div>
                <div className={s.info()}>
                    <h2 className={s.name()}>{user.displayName || "User"}</h2>
                    <p className={s.email()}>{user.email}</p>
                </div>
            </div>
            {actions && <div className={s.actions()}>{actions}</div>}
        </div>
    );
}
