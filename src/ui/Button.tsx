import { Button as BaseButton } from "@base-ui/react/button";
import { Icon } from "@iconify/react";
import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    slots: {
        button: "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-accent/40 active:scale-[0.97] gap-2",
        icon: "size-5",
    },
    variants: {
        variant: {
            primary: {
                button: "bg-linear-to-r from-accent to-yellow-600 text-surface hover:shadow-xl hover:shadow-accent/30 hover:brightness-110",
            },
            secondary: {
                button: "glass text-primary hover:bg-white/8 hover:border-white/12 border border-white/6",
            },
            ghost: {
                button: "bg-transparent text-muted hover:text-primary hover:bg-white/4",
            },
        },
        size: {
            sm: { button: "h-8 px-3 text-sm rounded-button" },
            md: { button: "h-10 px-5 text-sm rounded-button" },
            lg: { button: "h-12 px-6 text-base rounded-button" },
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
    },
});

type ButtonVariants = VariantProps<typeof styles>;

type ButtonProps = ButtonVariants & {
    children: React.ReactNode;
    icon?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit";
    onClick?: () => void;
};

/** Primary action button */
export function Button({
    variant,
    size,
    children,
    icon,
    disabled,
    loading,
    type = "button",
    onClick,
}: ButtonProps) {
    const s = styles({ variant, size });
    const displayIcon = loading ? "eos-icons:loading" : icon;

    return (
        <BaseButton
            type={type}
            className={s.button()}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {displayIcon && <Icon icon={displayIcon} className={s.icon()} />}
            {children}
        </BaseButton>
    );
}
