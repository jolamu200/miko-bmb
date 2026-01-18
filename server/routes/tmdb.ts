import { sValidator } from "@hono/standard-validator";
import { type } from "arktype";
import { Hono } from "hono";
import { tmdb } from "../lib/tmdb";

// Validation schemas
const TrendingParams = type({
    mediaType: "'movie' | 'tv' | 'all'",
    timeWindow: "'day' | 'week'",
});

const IdParam = type({
    id: "string.digits",
});

const SeasonParams = type({
    id: "string.digits",
    season: "string.digits",
});

const DiscoverParams = type({
    mediaType: "'movie' | 'tv'",
});

const PageQuery = type({
    "page?": "string.digits",
});

const SearchQuery = type({
    query: "string > 0",
    "page?": "string.digits",
});

export const tmdbRoutes = new Hono()
    .get(
        "/trending/:mediaType/:timeWindow",
        sValidator("param", TrendingParams),
        async (c) => {
            const { mediaType, timeWindow } = c.req.valid("param");
            return c.json(await tmdb(`/trending/${mediaType}/${timeWindow}`));
        },
    )
    .get("/movie/popular", sValidator("query", PageQuery), async (c) => {
        const { page = "1" } = c.req.valid("query");
        return c.json(await tmdb("/movie/popular", { query: { page } }));
    })
    .get("/tv/top_rated", sValidator("query", PageQuery), async (c) => {
        const { page = "1" } = c.req.valid("query");
        return c.json(await tmdb("/tv/top_rated", { query: { page } }));
    })
    .get("/movie/:id", sValidator("param", IdParam), async (c) => {
        const { id } = c.req.valid("param");
        return c.json(await tmdb(`/movie/${id}`));
    })
    .get("/tv/:id", sValidator("param", IdParam), async (c) => {
        const { id } = c.req.valid("param");
        return c.json(await tmdb(`/tv/${id}`));
    })
    .get(
        "/tv/:id/season/:season",
        sValidator("param", SeasonParams),
        async (c) => {
            const { id, season } = c.req.valid("param");
            return c.json(await tmdb(`/tv/${id}/season/${season}`));
        },
    )
    .get("/search/multi", sValidator("query", SearchQuery), async (c) => {
        const { query, page = "1" } = c.req.valid("query");
        return c.json(await tmdb("/search/multi", { query: { query, page } }));
    })
    .get(
        "/movie/:id/recommendations",
        sValidator("param", IdParam),
        sValidator("query", PageQuery),
        async (c) => {
            const { id } = c.req.valid("param");
            const { page = "1" } = c.req.valid("query");
            return c.json(
                await tmdb(`/movie/${id}/recommendations`, { query: { page } }),
            );
        },
    )
    .get(
        "/tv/:id/recommendations",
        sValidator("param", IdParam),
        sValidator("query", PageQuery),
        async (c) => {
            const { id } = c.req.valid("param");
            const { page = "1" } = c.req.valid("query");
            return c.json(
                await tmdb(`/tv/${id}/recommendations`, { query: { page } }),
            );
        },
    )
    .get(
        "/discover/:mediaType",
        sValidator("param", DiscoverParams),
        async (c) => {
            const { mediaType } = c.req.valid("param");
            return c.json(
                await tmdb(`/discover/${mediaType}`, { query: c.req.query() }),
            );
        },
    );
