import { Toast as BaseToast } from "@base-ui/react/toast";
import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";

const styles = tv({
    slots: {
        viewport:
            "fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]",
        root: "glass rounded-card p-4 shadow-lg transition-all duration-300 data-starting-style:translate-x-full data-starting-style:opacity-0 data-ending-style:translate-x-full data-ending-style:opacity-0",
        content: "flex items-start gap-3",
        icon: "size-5 shrink-0 mt-0.5",
        text: "flex-1 min-w-0",
        title: "text-sm font-medium text-primary",
        description: "text-xs text-muted mt-0.5",
        close: "shrink-0 size-5 text-muted hover:text-primary transition-colors cursor-pointer",
    },
    variants: {
        type: {
            success: { icon: "text-green-400" },
            error: { icon: "text-red-400" },
            info: { icon: "text-accent" },
        },
    },
    defaultVariants: {
        type: "info",
    },
});

export type ToastType = "success" | "error" | "info";

export type ToastData = {
    title: string;
    description?: string;
    type?: ToastType;
};

const icons: Record<ToastType, string> = {
    success: "mdi:check-circle",
    error: "ph:warning-fill",
    info: "mdi:information",
};

function ToastList() {
    const { toasts } = BaseToast.useToastManager();
    const s = styles();

    return toasts.map((toast) => {
        const data = toast.data as ToastData | undefined;
        const type: ToastType = data?.type ?? "info";
        const iconStyles = styles({ type });

        return (
            <BaseToast.Root key={toast.id} toast={toast} className={s.root()}>
                <div className={s.content()}>
                    <Icon icon={icons[type]} className={iconStyles.icon()} />
                    <div className={s.text()}>
                        <BaseToast.Title className={s.title()} />
                        <BaseToast.Description className={s.description()} />
                    </div>
                    <BaseToast.Close className={s.close()}>
                        <Icon icon="mdi:close" />
                    </BaseToast.Close>
                </div>
            </BaseToast.Root>
        );
    });
}

/** Toast provider - wrap app root */
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const s = styles();

    return (
        <BaseToast.Provider timeout={4000}>
            {children}
            <BaseToast.Portal>
                <BaseToast.Viewport className={s.viewport()}>
                    <ToastList />
                </BaseToast.Viewport>
            </BaseToast.Portal>
        </BaseToast.Provider>
    );
}

/** Hook to show toasts */
export function useToast() {
    const manager = BaseToast.useToastManager();

    return {
        show: (data: ToastData) =>
            manager.add({
                title: data.title,
                description: data.description,
                data,
            }),
        success: (title: string, description?: string) =>
            manager.add({
                title,
                description,
                data: { title, description, type: "success" } as ToastData,
            }),
        error: (title: string, description?: string) =>
            manager.add({
                title,
                description,
                data: { title, description, type: "error" } as ToastData,
            }),
        info: (title: string, description?: string) =>
            manager.add({
                title,
                description,
                data: { title, description, type: "info" } as ToastData,
            }),
    };
}
