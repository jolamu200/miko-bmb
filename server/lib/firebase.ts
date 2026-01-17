import { styleText } from "node:util";
import admin from "firebase-admin";
import { tsEnv } from "./typed-env";

const serviceAccount = JSON.parse(tsEnv.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const firebaseAuth = admin.auth();
export const db = admin.firestore();

console.log(styleText("yellow", "OK : Firebase Initialised"));
