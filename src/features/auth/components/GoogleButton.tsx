import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        button: "w-full flex items-center justify-center gap-3 h-11 px-4 bg-white text-gray-800 font-medium rounded-button hover:bg-gray-100 transition-colors",
    },
});

/** Google OAuth sign-in button */
export function GoogleButton() {
    const { button } = styles();

    return (
        <a href="/api/auth/google" className={button()}>
            <Icon icon="flat-color-icons:google" className="size-5" />
            Continue with Google
        </a>
    );
}
