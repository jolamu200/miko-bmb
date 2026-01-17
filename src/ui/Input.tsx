import { tv } from "tailwind-variants";

const input = tv({
    base: "w-full bg-surface-raised text-primary placeholder:text-muted border border-border rounded-button px-4 h-10 outline-none focus:border-accent transition-colors",
});

type InputProps = {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "email" | "password";
};

/** Text input field */
export function Input({
    placeholder,
    value,
    onChange,
    type = "text",
}: InputProps) {
    return (
        <input
            type={type}
            className={input()}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
