import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import type { LoginCredentials, User } from "../types";

const api = ofetch.create({ baseURL: "/api/auth" });

/** Fetch current authenticated user */
export function useUser() {
    return useQuery({
        queryKey: ["auth", "user"],
        queryFn: () => api<User>("/me"),
        retry: false,
        staleTime: 1000 * 60 * 5,
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
            queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        },
    });
}
