import { Hono } from "hono";
import { db } from "../lib/firebase";
import { sessionMiddleware } from "../middleware/session";

type Variables = {
    uid: string;
};

type HistoryItem = {
    id: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath: string | null;
    watchedAt: number;
    season?: number;
    episode?: number;
};

function getHistoryRef(uid: string) {
    return db.collection("users").doc(uid).collection("history");
}

export const historyRoutes = new Hono<{ Variables: Variables }>()
    .use(sessionMiddleware)

    // Get user's watch history (recent 50)
    .get("/", async (c) => {
        const uid = c.get("uid");
        const snapshot = await getHistoryRef(uid)
            .orderBy("watchedAt", "desc")
            .limit(50)
            .get();

        const items = snapshot.docs.map((doc) => doc.data() as HistoryItem);
        return c.json(items);
    })

    // Add to history (upsert - updates watchedAt if exists)
    .post("/", async (c) => {
        const uid = c.get("uid");
        const body = await c.req.json<Omit<HistoryItem, "watchedAt">>();
        const { id, mediaType, title, posterPath, season, episode } = body;

        const docId = `${mediaType}-${id}`;
        const item: HistoryItem = {
            id,
            mediaType,
            title,
            posterPath,
            watchedAt: Date.now(),
            ...(season !== undefined && { season }),
            ...(episode !== undefined && { episode }),
        };

        await getHistoryRef(uid).doc(docId).set(item);
        return c.json(item);
    })

    // Remove from history
    .delete("/:mediaType/:id", async (c) => {
        const uid = c.get("uid");
        const { mediaType, id } = c.req.param();
        const docId = `${mediaType}-${id}`;

        await getHistoryRef(uid).doc(docId).delete();
        return c.json({ ok: true });
    });
