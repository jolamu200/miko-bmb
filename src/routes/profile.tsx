import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
    useLogout,
    useUpdateProfile,
    useUser,
} from "~/features/auth/auth.hooks";
import { ProfileCard } from "~/features/auth/components/ProfileCard";
import { useClearHistory } from "~/features/history/history.hooks";
import { useClearWatchlist } from "~/features/watchlist/watchlist.hooks";
import { AuthGuard } from "~/ui/AuthGuard";
import { Button } from "~/ui/Button";
import { Input } from "~/ui/Input";
import { PageLayout } from "~/ui/PageLayout";
import { SectionHeader } from "~/ui/SectionHeader";
import { Stack } from "~/ui/Stack";
import { useToast } from "~/ui/Toast";

export const Route = createFileRoute("/profile")({
    component: () => (
        <AuthGuard>
            <ProfilePage />
        </AuthGuard>
    ),
});

function UpdateProfileSection() {
    const toast = useToast();
    const updateProfile = useUpdateProfile();
    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState("");

    const hasChanges = name.trim() || photoURL.trim();

    const handleUpdate = () => {
        const updates: { displayName?: string; photoURL?: string } = {};
        if (name.trim()) updates.displayName = name.trim();
        if (photoURL.trim()) updates.photoURL = photoURL.trim();

        updateProfile.mutate(updates, {
            onSuccess: () => {
                toast.success("Profile updated");
                setName("");
                setPhotoURL("");
            },
            onError: () => toast.error("Failed to update profile"),
        });
    };

    return (
        <Stack gap="sm">
            <SectionHeader icon="mdi:pencil" title="Update Profile" />
            <Input
                icon="mdi:account"
                placeholder="New display name"
                value={name}
                onChange={setName}
            />
            <Input
                icon="mdi:image"
                placeholder="Photo URL"
                value={photoURL}
                onChange={setPhotoURL}
            />
            <Button
                variant="secondary"
                icon="mdi:check"
                onClick={handleUpdate}
                disabled={!hasChanges}
                loading={updateProfile.isPending}
            >
                Update Profile
            </Button>
        </Stack>
    );
}

function ClearDataSection() {
    const toast = useToast();
    const clearWatchlist = useClearWatchlist();
    const clearHistory = useClearHistory();

    const handleClearWatchlist = () => {
        clearWatchlist.mutate(undefined, {
            onSuccess: () => toast.success("Watchlist cleared"),
            onError: () => toast.error("Failed to clear watchlist"),
        });
    };

    const handleClearHistory = () => {
        clearHistory.mutate(undefined, {
            onSuccess: () => toast.success("History cleared"),
            onError: () => toast.error("Failed to clear history"),
        });
    };

    return (
        <Stack gap="sm">
            <SectionHeader icon="mdi:delete" title="Clear Data" />
            <Button
                variant="secondary"
                icon="mdi:bookmark-off"
                onClick={handleClearWatchlist}
                loading={clearWatchlist.isPending}
            >
                Clear Watchlist
            </Button>
            <Button
                variant="secondary"
                icon="mdi:history-remove"
                onClick={handleClearHistory}
                loading={clearHistory.isPending}
            >
                Clear History
            </Button>
        </Stack>
    );
}

function AccountSection() {
    const navigate = useNavigate();
    const logout = useLogout();

    const handleSignOut = () => {
        logout.mutate(undefined, {
            onSuccess: () => navigate({ to: "/" }),
        });
    };

    return (
        <Stack gap="sm">
            <SectionHeader icon="mdi:shield-account" title="Account" />
            <Button
                variant="ghost"
                icon="mdi:logout-variant"
                onClick={handleSignOut}
                loading={logout.isPending}
            >
                Sign Out
            </Button>
        </Stack>
    );
}

function ProfilePage() {
    const { data: user } = useUser();

    // User is guaranteed by AuthGuard
    if (!user) return null;

    return (
        <PageLayout maxWidth="sm" spacing="md">
            <Stack gap="sm">
                <SectionHeader icon="mdi:account-circle" title="Profile" />
                <ProfileCard user={user} />
            </Stack>
            <UpdateProfileSection />
            <ClearDataSection />
            <AccountSection />
        </PageLayout>
    );
}
