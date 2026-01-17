import { auth, credential, initializeApp } from "firebase-admin";
import { tsEnv } from "./typed-env";

const serviceAccount = JSON.parse(tsEnv.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
    credential: credential.cert(serviceAccount),
});

export const fireBaseAuth = auth();
