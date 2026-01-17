type FirebaseErrorResponse = {
    data?: {
        error?: {
            message?: string;
        };
    };
};

const ERROR_MESSAGES: Record<string, string> = {
    EMAIL_EXISTS: "Email already in use",
    WEAK_PASSWORD: "Password must be at least 6 characters",
    INVALID_EMAIL: "Invalid email address",
    EMAIL_NOT_FOUND: "Email not found",
    INVALID_PASSWORD: "Incorrect password",
    INVALID_LOGIN_CREDENTIALS: "Invalid email or password",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts, try again later",
    USER_DISABLED: "Account has been disabled",
    OPERATION_NOT_ALLOWED: "Operation not allowed",
};

function parsePasswordRequirements(message: string): string | null {
    const match = message.match(/\[(.+)\]/);
    if (!match) return null;

    return match[1]
        .split(",")
        .map((req) =>
            req
                .trim()
                .toLowerCase()
                .replace("password must contain ", "")
                .replace("password must be ", ""),
        )
        .join(", ");
}

/** Extracts user-friendly error message from Firebase REST API errors */
export function getFirebaseErrorMessage(error: unknown): string {
    const message =
        (error as FirebaseErrorResponse)?.data?.error?.message || "";

    // Direct match
    if (message in ERROR_MESSAGES) {
        return ERROR_MESSAGES[message];
    }

    // Password requirements (e.g., uppercase, number, etc.)
    if (message.startsWith("PASSWORD_DOES_NOT_MEET_REQUIREMENTS")) {
        const requirements = parsePasswordRequirements(message);
        return requirements
            ? `Password needs: ${requirements}`
            : "Password does not meet requirements";
    }

    // Weak password with length requirement
    if (message.startsWith("WEAK_PASSWORD")) {
        return "Password must be at least 6 characters";
    }

    return message || "Authentication failed";
}
