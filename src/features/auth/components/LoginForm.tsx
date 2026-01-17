import { Toggle } from "@base-ui/react/toggle";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { Button } from "~/ui/Button";
import { Input } from "~/ui/Input";
import { useLogin, useRegister } from "../hooks/useAuth";

const styles = tv({
    slots: {
        form: "space-y-4",
        inputWrapper: "relative",
        inputIcon:
            "absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5 pointer-events-none",
        error: "text-sm text-red-400 text-center flex items-center justify-center gap-2",
        toggle: "text-sm text-center text-muted",
        toggleButton:
            "text-accent hover:text-accent-hover hover:underline cursor-pointer transition-colors ml-1",
        passwordWrapper: "relative",
        passwordToggle:
            "absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-all duration-200 cursor-pointer outline-none focus-visible:text-primary",
    },
});

type LoginFormProps = {
    onSuccess?: () => void;
};

/** Email/password login and registration form */
export function LoginForm({ onSuccess }: LoginFormProps) {
    const {
        form,
        inputWrapper,
        inputIcon,
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
            <div className={inputWrapper()}>
                <Icon icon="mdi:email-outline" className={inputIcon()} />
                <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={setEmail}
                />
            </div>
            <div className={passwordWrapper()}>
                <div className={inputWrapper()}>
                    <Icon icon="mdi:lock-outline" className={inputIcon()} />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                    />
                </div>
                <Toggle
                    pressed={showPassword}
                    onPressedChange={setShowPassword}
                    className={passwordToggle()}
                    aria-label={
                        showPassword ? "Hide password" : "Show password"
                    }
                >
                    <Icon
                        icon={
                            showPassword
                                ? "mdi:eye-off-outline"
                                : "mdi:eye-outline"
                        }
                        className="size-5"
                    />
                </Toggle>
            </div>

            {errorMessage && (
                <p className={errorStyle()}>
                    <Icon icon="mdi:alert-circle-outline" className="size-4" />
                    {errorMessage}
                </p>
            )}

            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Icon
                            icon="mdi:loading"
                            className="size-5 animate-spin"
                        />
                        Please wait...
                    </>
                ) : isRegister ? (
                    <>
                        <Icon icon="mdi:account-plus" className="size-5" />
                        Create Account
                    </>
                ) : (
                    <>
                        <Icon icon="mdi:login" className="size-5" />
                        Sign In
                    </>
                )}
            </Button>

            <p className={toggle()}>
                {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}
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
