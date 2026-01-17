import { ofetch } from "ofetch";
import { firebaseAuth } from "./firebase";
import { tsEnv } from "./typed-env";

/** Generate a valid Firebase ID token for testing */
export async function getTestIdToken(uid = "test-user-123") {
    const customToken = await firebaseAuth.createCustomToken(uid);

    const { idToken } = await ofetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${tsEnv.FIREBASE_API_KEY}`,
        {
            method: "POST",
            body: { token: customToken, returnSecureToken: true },
        },
    );

    return idToken as string;
}
