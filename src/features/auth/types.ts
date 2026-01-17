export type User = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
};

export type AuthError = {
    error: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};
