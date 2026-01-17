import { styleText } from "node:util";
import { type } from "arktype";

const schema = type({
    FIREBASE_SERVICE_ACCOUNT: "string.json",
    TMDB_TOKEN: "string > 1",
    FIREBASE_API_KEY: "string > 1",
    GOOGLE_CLIENT_ID: "string > 1",
    GOOGLE_CLIENT_SECRET: "string > 1",
});

export const tsEnv = schema.assert(process.env);

console.log(styleText("green", "OK : Environment Variables"));
