import { Hono } from "hono";
import { authRoutes } from "./routes/auth";
import { historyRoutes } from "./routes/history";
import { tmdbRoutes } from "./routes/tmdb";
import { watchlistRoutes } from "./routes/watchlist";

const app = new Hono()
    .basePath("/api")
    .get("/ok", (c) => {
        return c.json({
            data: "ok",
            timestamp: new Date().toLocaleString(),
        });
    })
    .route("/auth", authRoutes)
    .route("/tmdb", tmdbRoutes)
    .route("/watchlist", watchlistRoutes)
    .route("/history", historyRoutes);

export default app;

export type RPC = typeof app;
