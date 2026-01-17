import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { GoogleButton, LoginForm } from "~/features/auth";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

const styles = tv({
    slots: {
        container: "min-h-[80vh] flex items-center justify-center",
        card: "w-full max-w-sm bg-surface-raised rounded-card p-6 space-y-6",
        title: "text-2xl font-bold text-center",
        divider: "flex items-center gap-4",
        dividerLine: "flex-1 h-px bg-border",
        dividerText: "text-sm text-muted",
        errorBanner:
            "bg-red-500/10 text-red-500 text-sm p-3 rounded-button text-center",
    },
});

function LoginPage() {
    const {
        container,
        card,
        title,
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
                    <h1 className={title()}>Welcome</h1>

                    {error && (
                        <p className={errorBanner()}>
                            {error === "oauth_cancelled"
                                ? "Sign in was cancelled"
                                : "Sign in failed. Please try again."}
                        </p>
                    )}

                    <GoogleButton />

                    <div className={divider()}>
                        <div className={dividerLine()} />
                        <span className={dividerText()}>or</span>
                        <div className={dividerLine()} />
                    </div>

                    <LoginForm onSuccess={handleSuccess} />
                </div>
            </div>
        </PageLayout>
    );
}
