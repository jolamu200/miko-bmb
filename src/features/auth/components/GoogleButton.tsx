import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        button: "w-full flex items-center justify-center gap-3 h-12 px-4 bg-white text-gray-900 font-medium rounded-button hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]",
        iconWrapper: "size-5 flex items-center justify-center",
    },
});

/** Google OAuth sign-in button */
export function GoogleButton() {
    const { button, iconWrapper } = styles();

    return (
        <a href="/api/auth/google" className={button()}>
            <span className={iconWrapper()}>
                <Icon icon="flat-color-icons:google" className="size-5" />
            </span>
            Continue with Google
            <Icon
                icon="mdi:arrow-right"
                className="size-4 ml-auto opacity-50"
            />
        </a>
    );
}
