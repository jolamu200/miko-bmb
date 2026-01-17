import { auth, credential, initializeApp } from "firebase-admin";

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT as string,
);

initializeApp({
    credential: credential.cert(serviceAccount),
});

export const fireBaseAuth = auth();
