import { sValidator } from "@hono/standard-validator";
import { type } from "arktype";
import { Hono } from "hono";
import { db } from "../lib/firebase";
import { sessionMiddleware } from "../middleware/session";

type Variables = {
    uid: string;
};

type HistoryItem = {
    id: number;
    mediaType: "movie" | "tv";
    watchedAt: number;
    season?: number;
    episode?: number;
};

// Validation schemas
const MediaType = type("'movie' | 'tv'");

const AddHistoryBody = type({
    id: "number.integer > 0",
    mediaType: MediaType,
    "season?": "number.integer > 0",
    "episode?": "number.integer > 0",
});

const MediaParams = type({
    mediaType: MediaType,
    id: "string.digits",
});

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
    .post("/", sValidator("json", AddHistoryBody), async (c) => {
        const uid = c.get("uid");
        const { id, mediaType, season, episode } = c.req.valid("json");

        const docId = `${mediaType}-${id}`;
        const item: HistoryItem = {
            id,
            mediaType,
            watchedAt: Date.now(),
            ...(season !== undefined && { season }),
            ...(episode !== undefined && { episode }),
        };

        await getHistoryRef(uid).doc(docId).set(item);
        return c.json(item);
    })

    // Remove from history
    .delete("/:mediaType/:id", sValidator("param", MediaParams), async (c) => {
        const uid = c.get("uid");
        const { mediaType, id } = c.req.valid("param");
        const docId = `${mediaType}-${id}`;

        await getHistoryRef(uid).doc(docId).delete();
        return c.json({ ok: true });
    })

    // Clear entire history
    .delete("/", async (c) => {
        const uid = c.get("uid");
        const snapshot = await getHistoryRef(uid).get();

        const batch = db.batch();
        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
        }
        await batch.commit();

        return c.json({ ok: true });
    });
