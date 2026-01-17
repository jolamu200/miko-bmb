import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        root: "relative group",
        input: "w-full glass text-primary placeholder:text-muted/50 rounded-button pl-11 pr-4 h-12 outline-none focus:bg-white/6 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all duration-300",
        icon: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted size-5 transition-colors duration-300 group-focus-within:text-accent",
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
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        const timer = setTimeout(() => {
            onChangeRef.current(localValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className={root()}>
            <Icon icon="mdi:magnify" className={icon()} aria-hidden="true" />
            <input
                type="text"
                className={input()}
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                aria-label="Search"
            />
        </div>
    );
}
