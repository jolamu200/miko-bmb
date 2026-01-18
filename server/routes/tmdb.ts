import { Hono } from "hono";
import { tmdb } from "../lib/tmdb";

export const tmdbRoutes = new Hono()
    .get("/trending/:mediaType/:timeWindow", async (c) => {
        const { mediaType, timeWindow } = c.req.param();
        return c.json(await tmdb(`/trending/${mediaType}/${timeWindow}`));
    })
    .get("/movie/popular", async (c) => {
        const page = c.req.query("page") || "1";
        return c.json(await tmdb("/movie/popular", { query: { page } }));
    })
    .get("/tv/top_rated", async (c) => {
        const page = c.req.query("page") || "1";
        return c.json(await tmdb("/tv/top_rated", { query: { page } }));
    })
    .get("/movie/:id", async (c) => {
        const { id } = c.req.param();
        return c.json(await tmdb(`/movie/${id}`));
    })
    .get("/tv/:id", async (c) => {
        const { id } = c.req.param();
        return c.json(await tmdb(`/tv/${id}`));
    })
    .get("/tv/:id/season/:season", async (c) => {
        const { id, season } = c.req.param();
        return c.json(await tmdb(`/tv/${id}/season/${season}`));
    })
    .get("/search/multi", async (c) => {
        const query = c.req.query("query") || "";
        const page = c.req.query("page") || "1";
        return c.json(await tmdb("/search/multi", { query: { query, page } }));
    })
    .get("/movie/:id/recommendations", async (c) => {
        const { id } = c.req.param();
        const page = c.req.query("page") || "1";
        return c.json(
            await tmdb(`/movie/${id}/recommendations`, { query: { page } }),
        );
    })
    .get("/tv/:id/recommendations", async (c) => {
        const { id } = c.req.param();
        const page = c.req.query("page") || "1";
        return c.json(
            await tmdb(`/tv/${id}/recommendations`, { query: { page } }),
        );
    })
    .get("/discover/:mediaType", async (c) => {
        const { mediaType } = c.req.param();
        return c.json(
            await tmdb(`/discover/${mediaType}`, { query: c.req.query() }),
        );
    });
