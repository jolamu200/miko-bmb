import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tv/$id")({
    component: TvLayout,
});

function TvLayout() {
    return <Outlet />;
}
