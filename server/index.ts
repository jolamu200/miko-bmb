import { Hono } from "hono";
import "./lib/typed-env";
import { authRoutes } from "./routes/auth";
import { tmdbRoutes } from "./routes/tmdb";

const app = new Hono()
    .basePath("/api")
    .get("/ok", (c) => {
        return c.json({
            data: "ok",
            timestamp: new Date().toLocaleString(),
        });
    })
    .route("/auth", authRoutes)
    .route("/tmdb", tmdbRoutes);

export default app;

export type RPC = typeof app;
