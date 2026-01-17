import type { Context, Next } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { firebaseAuth } from "../lib/firebase";

const SESSION_COOKIE = "session";
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function sessionMiddleware(c: Context, next: Next) {
    const session = getCookie(c, SESSION_COOKIE);
    if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    try {
        const decoded = await firebaseAuth.verifySessionCookie(session, true);
        c.set("uid", decoded.uid);
        await next();
    } catch {
        return c.json({ error: "Invalid session" }, 401);
    }
}

export async function createSession(c: Context, idToken: string) {
    const sessionCookie = await firebaseAuth.createSessionCookie(idToken, {
        expiresIn: SESSION_EXPIRY,
    });

    setCookie(c, SESSION_COOKIE, sessionCookie, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: SESSION_EXPIRY / 1000,
        path: "/",
    });
}

export function clearSession(c: Context) {
    deleteCookie(c, SESSION_COOKIE, { path: "/" });
}
