import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth";
import { historyRoutes } from "./routes/history";
import { tmdbRoutes } from "./routes/tmdb";
import { watchlistRoutes } from "./routes/watchlist";

const app = new Hono()
    .use(logger())
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
