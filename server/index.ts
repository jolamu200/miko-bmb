import { Hono } from "hono";

const app = new Hono().basePath("/api").get("/ok", (c) => {
    return c.json({
        data: "ok",
        timestamp: new Date().toLocaleString(),
    });
});

export default app;

export type RPC = typeof app;
