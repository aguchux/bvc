import { getSessionCookieValue } from "./session";

export const COOKIE_NAME = "mvc_session";
export const COOKIE_VALUE_PREFIX = "logged-in";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const encode = (value: string) => encodeURIComponent(value);

const attributes = (maxAge: number, secure: boolean) => {
    const parts = ["Path=/", `Max-Age=${maxAge}`, "SameSite="];
    if (secure) {
        parts.push("Secure");
    }
    return parts.join("; ");
};

const isProduction = process.env.NODE_ENV === "production";
const isSecureContext = (secureOverride?: boolean) => {
    if (typeof secureOverride === "boolean") return secureOverride;
    return isProduction;
};

export function buildSessionValue(identifier?: string, token?: string) {
    const segments = [COOKIE_VALUE_PREFIX];

    if (identifier) {
        segments.push(encode(identifier));
    }
    if (token) {
        segments.push(encode(token));
    }

    return segments.join(":");
}

export function getMoodleTokenFromSessionCookie(cookieString?: string) {
    const value = getSessionCookieValue(cookieString);
    if (!value) return null;
    const parts = value.split(":");
    if (parts.length < 3) return null;
    if (parts[0] !== COOKIE_VALUE_PREFIX) return null;

    const token = decodeURIComponent(parts[2]!);
    return token || null;
}

export function getSessionCookieHeader(
    secureOverride?: boolean,
    value?: string,
) {
    const secure = isSecureContext(secureOverride);
    const payload = value ? value : COOKIE_VALUE_PREFIX;
    return `${COOKIE_NAME}=${encode(payload)}; ${attributes(COOKIE_MAX_AGE, secure)}`;
}

export function getSessionClearCookieHeader(secureOverride?: boolean) {
    const secure = isSecureContext(secureOverride);
    return `${COOKIE_NAME}=${encode("")}; ${attributes(0, secure)}`;
}
