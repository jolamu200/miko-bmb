import { sValidator } from "@hono/standard-validator";
import { type } from "arktype";
import { Hono } from "hono";
import { ofetch } from "ofetch";
import { firebaseAuth } from "../lib/firebase";
import { getFirebaseErrorMessage } from "../lib/firebase-errors";
import { tsEnv } from "../lib/typed-env";
import {
    clearSession,
    createSession,
    sessionMiddleware,
} from "../middleware/session";

type Variables = {
    uid: string;
};

// Validation schemas
const LoginBody = type({
    idToken: "string > 0",
});

const EmailPasswordBody = type({
    email: "string.email",
    password: "string >= 6",
});

const FIREBASE_AUTH_URL = "https://identitytoolkit.googleapis.com/v1";
const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

type FirebaseAuthResponse = {
    idToken: string;
    email: string;
    localId: string;
};

function getRedirectUri(c: { req: { url: string } }) {
    const url = new URL(c.req.url);
    return `${url.origin}/api/auth/google/callback`;
}

export const authRoutes = new Hono<{ Variables: Variables }>()
    // Existing ID token login (for testing)
    .post("/login", sValidator("json", LoginBody), async (c) => {
        const { idToken } = c.req.valid("json");

        try {
            await firebaseAuth.verifyIdToken(idToken);
            await createSession(c, idToken);
            return c.json({ ok: true });
        } catch {
            return c.json({ error: "Invalid token" }, 401);
        }
    })

    // Email/password registration
    .post("/register", sValidator("json", EmailPasswordBody), async (c) => {
        const { email, password } = c.req.valid("json");

        try {
            const data = await ofetch<FirebaseAuthResponse>(
                `${FIREBASE_AUTH_URL}/accounts:signUp?key=${tsEnv.FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    body: { email, password, returnSecureToken: true },
                },
            );

            await createSession(c, data.idToken);
            return c.json({ ok: true });
        } catch (error) {
            return c.json({ error: getFirebaseErrorMessage(error) }, 400);
        }
    })

    // Email/password login
    .post("/login-email", sValidator("json", EmailPasswordBody), async (c) => {
        const { email, password } = c.req.valid("json");

        try {
            const data = await ofetch<FirebaseAuthResponse>(
                `${FIREBASE_AUTH_URL}/accounts:signInWithPassword?key=${tsEnv.FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    body: { email, password, returnSecureToken: true },
                },
            );

            await createSession(c, data.idToken);
            return c.json({ ok: true });
        } catch (error) {
            return c.json({ error: getFirebaseErrorMessage(error) }, 401);
        }
    })

    // Google OAuth redirect
    .get("/google", (c) => {
        const redirectUri = getRedirectUri(c);
        const params = new URLSearchParams({
            client_id: tsEnv.GOOGLE_CLIENT_ID,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
        });

        return c.redirect(`${GOOGLE_OAUTH_URL}?${params}`);
    })

    // Google OAuth callback
    .get("/google/callback", async (c) => {
        const code = c.req.query("code");
        const error = c.req.query("error");

        if (error || !code) {
            return c.redirect("/login?error=oauth_cancelled");
        }

        try {
            // Exchange code for tokens
            const tokens = await ofetch<{
                access_token: string;
                id_token: string;
            }>(GOOGLE_TOKEN_URL, {
                method: "POST",
                body: new URLSearchParams({
                    code,
                    client_id: tsEnv.GOOGLE_CLIENT_ID,
                    client_secret: tsEnv.GOOGLE_CLIENT_SECRET,
                    redirect_uri: getRedirectUri(c),
                    grant_type: "authorization_code",
                }),
            });

            // Sign in with Google ID token via Firebase
            const data = await ofetch<FirebaseAuthResponse>(
                `${FIREBASE_AUTH_URL}/accounts:signInWithIdp?key=${tsEnv.FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    body: {
                        postBody: `id_token=${tokens.id_token}&providerId=google.com`,
                        requestUri: getRedirectUri(c),
                        returnSecureToken: true,
                    },
                },
            );

            await createSession(c, data.idToken);
            return c.redirect("/");
        } catch {
            return c.redirect("/login?error=oauth_failed");
        }
    })

    // Get current user
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

    // Logout
    .post("/logout", (c) => {
        clearSession(c);
        return c.json({ ok: true });
    });
