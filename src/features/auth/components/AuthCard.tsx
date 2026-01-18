import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        wrapper: "min-h-[80vh] flex items-center justify-center px-4",
        root: "w-full max-w-md glass-strong rounded-card p-8 space-y-6 animate-scale-in shadow-2xl shadow-black/50",
        header: "text-center space-y-2",
        logoIcon: "size-12 text-accent mx-auto mb-2",
        title: "text-2xl font-bold bg-linear-to-r from-accent via-yellow-200 to-accent bg-clip-text text-transparent",
        subtitle: "text-sm text-muted",
        divider: "flex items-center gap-4",
        dividerLine: "flex-1 h-px bg-white/8",
        dividerText: "text-xs text-muted uppercase tracking-wider",
        errorBanner:
            "bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-button text-center flex items-center justify-center gap-2",
    },
});

type AuthCardProps = {
    title: string;
    subtitle: string;
    error?: string | null;
    children: React.ReactNode;
    dividerText?: string;
    belowDivider?: React.ReactNode;
};

/** Card container for authentication forms */
export function AuthCard({
    title,
    subtitle,
    error,
    children,
    dividerText,
    belowDivider,
}: AuthCardProps) {
    const s = styles();

    return (
        <div className={s.wrapper()}>
            <div className={s.root()}>
                <div className={s.header()}>
                    <Icon icon="mdi:play-circle" className={s.logoIcon()} />
                    <h1 className={s.title()}>{title}</h1>
                    <p className={s.subtitle()}>{subtitle}</p>
                </div>

                {error && (
                    <p className={s.errorBanner()}>
                        <Icon icon="mdi:alert-circle" className="size-4" />
                        {error}
                    </p>
                )}

                {children}

                {dividerText && (
                    <div className={s.divider()}>
                        <div className={s.dividerLine()} />
                        <span className={s.dividerText()}>{dividerText}</span>
                        <div className={s.dividerLine()} />
                    </div>
                )}

                {belowDivider}
            </div>
        </div>
    );
}
