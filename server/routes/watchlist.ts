import { sValidator } from "@hono/standard-validator";
import { type } from "arktype";
import { Hono } from "hono";
import { db } from "../lib/firebase";
import { sessionMiddleware } from "../middleware/session";

type Variables = {
    uid: string;
};

type WatchlistItem = {
    id: number;
    mediaType: "movie" | "tv";
    addedAt: number;
};

// Validation schemas
const MediaType = type("'movie' | 'tv'");

const AddWatchlistBody = type({
    id: "number.integer > 0",
    mediaType: MediaType,
});

const MediaParams = type({
    mediaType: MediaType,
    id: "string.digits",
});

function getWatchlistRef(uid: string) {
    return db.collection("users").doc(uid).collection("watchlist");
}

export const watchlistRoutes = new Hono<{ Variables: Variables }>()
    .use(sessionMiddleware)

    // Get user's watchlist
    .get("/", async (c) => {
        const uid = c.get("uid");
        const snapshot = await getWatchlistRef(uid)
            .orderBy("addedAt", "desc")
            .get();

        const items = snapshot.docs.map((doc) => doc.data() as WatchlistItem);
        return c.json(items);
    })

    // Check if item is in watchlist
    .get("/:mediaType/:id", sValidator("param", MediaParams), async (c) => {
        const uid = c.get("uid");
        const { mediaType, id } = c.req.valid("param");
        const docId = `${mediaType}-${id}`;

        const doc = await getWatchlistRef(uid).doc(docId).get();
        return c.json({ inWatchlist: doc.exists });
    })

    // Add to watchlist
    .post("/", sValidator("json", AddWatchlistBody), async (c) => {
        const uid = c.get("uid");
        const { id, mediaType } = c.req.valid("json");

        const docId = `${mediaType}-${id}`;
        const item: WatchlistItem = {
            id,
            mediaType,
            addedAt: Date.now(),
        };

        await getWatchlistRef(uid).doc(docId).set(item);
        return c.json(item);
    })

    // Remove from watchlist
    .delete("/:mediaType/:id", sValidator("param", MediaParams), async (c) => {
        const uid = c.get("uid");
        const { mediaType, id } = c.req.valid("param");
        const docId = `${mediaType}-${id}`;

        await getWatchlistRef(uid).doc(docId).delete();
        return c.json({ ok: true });
    })

    // Clear entire watchlist
    .delete("/", async (c) => {
        const uid = c.get("uid");
        const snapshot = await getWatchlistRef(uid).get();

        const batch = db.batch();
        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
        }
        await batch.commit();

        return c.json({ ok: true });
    });
