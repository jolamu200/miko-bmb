import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "relative",
        input: "w-full bg-surface-raised text-primary placeholder:text-muted border border-border rounded-button pl-10 pr-4 h-10 outline-none focus:border-accent transition-colors",
        icon: "absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5",
    },
});

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
};

/** Debounced search input with icon */
export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    debounceMs = 300,
}: SearchInputProps) {
    const { root, input, icon } = styles();
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className={root()}>
            <Icon icon="mdi:magnify" className={icon()} />
            <input
                type="text"
                className={input()}
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
            />
        </div>
    );
}
