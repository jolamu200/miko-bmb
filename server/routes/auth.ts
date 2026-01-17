import { Hono } from "hono";
import { firebaseAuth } from "../lib/firebase";
import {
    clearSession,
    createSession,
    sessionMiddleware,
} from "../middleware/session";

type Variables = {
    uid: string;
};

export const authRoutes = new Hono<{ Variables: Variables }>()
    .post("/login", async (c) => {
        const { idToken } = await c.req.json<{ idToken: string }>();

        try {
            await firebaseAuth.verifyIdToken(idToken);
            await createSession(c, idToken);
            return c.json({ ok: true });
        } catch {
            return c.json({ error: "Invalid token" }, 401);
        }
    })
    .get("/me", sessionMiddleware, async (c) => {
        const uid = c.get("uid") as string;
        const user = await firebaseAuth.getUser(uid);

        return c.json({
            uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });
    })
    .post("/logout", (c) => {
        clearSession(c);
        return c.json({ ok: true });
    });
