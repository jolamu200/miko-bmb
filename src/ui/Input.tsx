import { Input as BaseInput } from "@base-ui/react/input";
import { Icon } from "@iconify/react";
import { tv, type VariantProps } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "relative group",
        input: "w-full glass text-primary placeholder:text-muted/50 pr-4 h-12 outline-none focus:bg-white/6 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all duration-300 rounded-button",
        icon: "absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted pointer-events-none transition-colors duration-300 group-focus-within:text-accent",
    },
    variants: {
        hasIcon: {
            true: { input: "pl-11" },
            false: { input: "pl-4" },
        },
    },
    defaultVariants: {
        hasIcon: false,
    },
});

type InputProps = VariantProps<typeof styles> & {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "email" | "password";
    icon?: string;
};

/** Text input field with optional leading icon */
export function Input({
    placeholder,
    value,
    onChange,
    type = "text",
    icon,
}: InputProps) {
    const hasIcon = Boolean(icon);
    const s = styles({ hasIcon });

    if (icon) {
        return (
            <div className={s.root()}>
                <Icon icon={icon} className={s.icon()} />
                <BaseInput
                    type={type}
                    className={s.input()}
                    placeholder={placeholder}
                    value={value}
                    onValueChange={onChange}
                />
            </div>
        );
    }

    return (
        <BaseInput
            type={type}
            className={s.input()}
            placeholder={placeholder}
            value={value}
            onValueChange={onChange}
        />
    );
}
