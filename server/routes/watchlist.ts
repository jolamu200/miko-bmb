import { Hono } from "hono";
import { db } from "../lib/firebase";
import { sessionMiddleware } from "../middleware/session";

type Variables = {
    uid: string;
};

type WatchlistItem = {
    id: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath: string | null;
    addedAt: number;
};

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
    .get("/:mediaType/:id", async (c) => {
        const uid = c.get("uid");
        const { mediaType, id } = c.req.param();
        const docId = `${mediaType}-${id}`;

        const doc = await getWatchlistRef(uid).doc(docId).get();
        return c.json({ inWatchlist: doc.exists });
    })

    // Add to watchlist
    .post("/", async (c) => {
        const uid = c.get("uid");
        const { id, mediaType, title, posterPath } =
            await c.req.json<Omit<WatchlistItem, "addedAt">>();

        const docId = `${mediaType}-${id}`;
        const item: WatchlistItem = {
            id,
            mediaType,
            title,
            posterPath,
            addedAt: Date.now(),
        };

        await getWatchlistRef(uid).doc(docId).set(item);
        return c.json(item);
    })

    // Remove from watchlist
    .delete("/:mediaType/:id", async (c) => {
        const uid = c.get("uid");
        const { mediaType, id } = c.req.param();
        const docId = `${mediaType}-${id}`;

        await getWatchlistRef(uid).doc(docId).delete();
        return c.json({ ok: true });
    });
