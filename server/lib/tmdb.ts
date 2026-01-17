import { ofetch } from "ofetch";
import { tsEnv } from "./typed-env";

export const tmdb = ofetch.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Authorization: `Bearer ${tsEnv.TMDB_TOKEN}`,
    },
});
