import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthCard } from "~/features/auth/components/AuthCard";
import { GoogleButton } from "~/features/auth/components/GoogleButton";
import { LoginForm } from "~/features/auth/components/LoginForm";
import { PageLayout } from "~/ui/PageLayout";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

function LoginPage() {
    const navigate = useNavigate();
    const error = new URLSearchParams(window.location.search).get("error");

    const errorMessage = error
        ? error === "oauth_cancelled"
            ? "Sign in was cancelled"
            : "Sign in failed. Please try again."
        : null;

    function handleSuccess() {
        navigate({ to: "/" });
    }

    return (
        <PageLayout>
            <AuthCard
                title="Welcome to Miko"
                subtitle="Sign in to access your watchlist and preferences"
                error={errorMessage}
                dividerText="or continue with email"
                belowDivider={<LoginForm onSuccess={handleSuccess} />}
            >
                <GoogleButton />
            </AuthCard>
        </PageLayout>
    );
}
