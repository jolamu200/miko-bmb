import { Icon } from "@iconify/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { GoogleButton } from "~/features/auth/components/GoogleButton";
import { LoginForm } from "~/features/auth/components/LoginForm";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

const styles = tv({
    slots: {
        container: "min-h-[80vh] flex items-center justify-center px-4",
        card: "w-full max-w-sm glass-strong rounded-card p-8 space-y-6 animate-scale-in shadow-2xl shadow-black/50",
        header: "text-center space-y-2",
        logoIcon: "size-12 text-accent mx-auto mb-2",
        title: "text-2xl font-bold bg-gradient-to-r from-accent via-yellow-200 to-accent bg-clip-text text-transparent",
        subtitle: "text-sm text-muted",
        divider: "flex items-center gap-4",
        dividerLine: "flex-1 h-px bg-white/8",
        dividerText: "text-xs text-muted uppercase tracking-wider",
        errorBanner:
            "bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-button text-center flex items-center justify-center gap-2",
    },
});

function LoginPage() {
    const {
        container,
        card,
        header,
        logoIcon,
        title,
        subtitle,
        divider,
        dividerLine,
        dividerText,
        errorBanner,
    } = styles();
    const navigate = useNavigate();
    const error = new URLSearchParams(window.location.search).get("error");

    function handleSuccess() {
        navigate({ to: "/" });
    }

    return (
        <PageLayout>
            <div className={container()}>
                <div className={card()}>
                    <div className={header()}>
                        <Icon icon="mdi:play-circle" className={logoIcon()} />
                        <h1 className={title()}>Welcome to Miko</h1>
                        <p className={subtitle()}>
                            Sign in to access your watchlist and preferences
                        </p>
                    </div>

                    {error && (
                        <p className={errorBanner()}>
                            <Icon icon="mdi:alert-circle" className="size-4" />
                            {error === "oauth_cancelled"
                                ? "Sign in was cancelled"
                                : "Sign in failed. Please try again."}
                        </p>
                    )}

                    <GoogleButton />

                    <div className={divider()}>
                        <div className={dividerLine()} />
                        <span className={dividerText()}>
                            or continue with email
                        </span>
                        <div className={dividerLine()} />
                    </div>

                    <LoginForm onSuccess={handleSuccess} />
                </div>
            </div>
        </PageLayout>
    );
}
