import { Icon } from "@iconify/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { Button } from "~/ui/Button";
import { Input } from "~/ui/Input";
import { useLogin, useRegister } from "../hooks/useAuth";

const styles = tv({
    slots: {
        form: "space-y-4",
        error: "text-sm text-red-500 text-center",
        toggle: "text-sm text-center text-muted",
        toggleButton: "text-accent hover:underline cursor-pointer",
        passwordWrapper: "relative",
        passwordToggle:
            "absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors",
    },
});

type LoginFormProps = {
    onSuccess?: () => void;
};

/** Email/password login and registration form */
export function LoginForm({ onSuccess }: LoginFormProps) {
    const {
        form,
        error: errorStyle,
        toggle,
        toggleButton,
        passwordWrapper,
        passwordToggle,
    } = styles();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const login = useLogin();
    const register = useRegister();

    const mutation = isRegister ? register : login;
    const isLoading = mutation.isPending;
    const error = mutation.error;

    // Extract error message from ofetch error (stored in error.data)
    const errorMessage = error
        ? (error as { data?: { error?: string } }).data?.error ||
          error.message ||
          "Authentication failed"
        : null;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        mutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    onSuccess?.();
                },
            },
        );
    }

    return (
        <form onSubmit={handleSubmit} className={form()}>
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={setEmail}
            />
            <div className={passwordWrapper()}>
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                />
                <button
                    type="button"
                    className={passwordToggle()}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <Icon
                        icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                        className="size-5"
                    />
                </button>
            </div>

            {errorMessage && <p className={errorStyle()}>{errorMessage}</p>}

            <Button type="submit" disabled={isLoading}>
                {isLoading
                    ? "Loading..."
                    : isRegister
                      ? "Create Account"
                      : "Sign In"}
            </Button>

            <p className={toggle()}>
                {isRegister ? "Already have an account? " : "New here? "}
                <button
                    type="button"
                    className={toggleButton()}
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? "Sign In" : "Create Account"}
                </button>
            </p>
        </form>
    );
}
