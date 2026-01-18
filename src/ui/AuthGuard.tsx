import { Navigate } from "@tanstack/react-router";
import { useUser } from "~/features/auth/auth.hooks";
import { EmptyState } from "./EmptyState";
import { PageLayout } from "./PageLayout";

type AuthGuardProps = {
    children: React.ReactNode;
};

/** Requires authentication - redirects to /login if not logged in */
export function AuthGuard({ children }: AuthGuardProps) {
    const { data: user, isLoading } = useUser();

    if (isLoading) {
        return (
            <PageLayout>
                <EmptyState icon="eos-icons:loading" title="Loading..." />
            </PageLayout>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

/** Requires guest (not logged in) - redirects to / if authenticated */
export function GuestGuard({ children }: AuthGuardProps) {
    const { data: user, isLoading } = useUser();

    if (isLoading) {
        return (
            <PageLayout>
                <EmptyState icon="eos-icons:loading" title="Loading..." />
            </PageLayout>
        );
    }

    if (user) {
        return <Navigate to="/" />;
    }

    return children;
}
