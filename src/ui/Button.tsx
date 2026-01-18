import { Button as BaseButton } from "@base-ui/react/button";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
    base: "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-accent/40 active:scale-[0.97] gap-2",
    variants: {
        variant: {
            primary:
                "bg-linear-to-r from-accent to-yellow-600 text-surface hover:shadow-xl hover:shadow-accent/30 hover:brightness-110",
            secondary:
                "glass text-primary hover:bg-white/8 hover:border-white/12 border border-white/6",
            ghost: "bg-transparent text-muted hover:text-primary hover:bg-white/4",
        },
        size: {
            sm: "h-8 px-3 text-sm rounded-button",
            md: "h-10 px-5 text-sm rounded-button",
            lg: "h-12 px-6 text-base rounded-button",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
    },
});

type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = ButtonVariants & {
    children: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit";
    onClick?: () => void;
};

/** Primary action button */
export function Button({
    variant,
    size,
    children,
    disabled,
    type = "button",
    onClick,
}: ButtonProps) {
    return (
        <BaseButton
            type={type}
            className={button({ variant, size })}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </BaseButton>
    );
}
