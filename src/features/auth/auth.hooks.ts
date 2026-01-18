import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import type { LoginCredentials, User } from "./types";

const api = ofetch.create({ baseURL: "/api/auth" });

/** Fetch current authenticated user */
export function useUser() {
    return useQuery({
        queryKey: ["auth", "user"],
        queryFn: () => api<User>("/me"),
        retry: false,
    });
}

/** Email/password login mutation */
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            api("/login-email", {
                method: "POST",
                body: credentials,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        },
    });
}

/** Email/password registration mutation */
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            api("/register", {
                method: "POST",
                body: credentials,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        },
    });
}

/** Logout mutation */
export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api("/logout", { method: "POST" }),
        onSuccess: () => {
            queryClient.setQueryData(["auth", "user"], null);
            queryClient.removeQueries({ queryKey: ["watchlist"] });
            queryClient.removeQueries({ queryKey: ["history"] });
        },
    });
}

/** Update user profile */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { displayName?: string; photoURL?: string }) =>
            api<User>("/profile", { method: "PATCH", body: data }),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["auth", "user"], updatedUser);
        },
    });
}
