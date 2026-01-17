import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navigation } from "~/ui/Navigation";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Navigation />
            <main className="pt-14">
                <Outlet />
            </main>
            <TanStackRouterDevtools />
        </>
    );
}
