import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
    base: "inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    variants: {
        variant: {
            primary: "bg-accent text-primary hover:bg-accent-hover",
            secondary:
                "bg-surface-raised text-primary hover:bg-surface-overlay",
            ghost: "bg-transparent hover:bg-surface-raised",
        },
        size: {
            sm: "h-8 px-3 text-sm rounded-button",
            md: "h-10 px-4 text-base rounded-button",
            lg: "h-12 px-6 text-lg rounded-button",
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
        <button
            type={type}
            className={button({ variant, size })}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
