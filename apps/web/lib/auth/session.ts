import {
  COOKIE_NAME,
  COOKIE_VALUE_PREFIX,
  getSessionClearCookieHeader,
  getSessionCookieHeader,
} from "./cookie";

const getCookieSource = (cookieString?: string) => {
  if (typeof document !== "undefined" && !cookieString) {
    return document.cookie ?? "";
  }
  return cookieString ?? "";
};

const decode = (value: string) => decodeURIComponent(value);

const isSecureContext = () => {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
};

export function setSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = getSessionCookieHeader(isSecureContext());
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = getSessionClearCookieHeader(isSecureContext());
}

function parseSessionValue(cookieString?: string) {
  const value = getSessionCookieValue(cookieString);
  if (!value) return null;
  const parts = value.split(":");
  if (!parts.length) return null;
  if (parts[0] !== COOKIE_VALUE_PREFIX) return null;

  const identifier =
    parts.length > 1 && parts[1] ? decode(parts[1]) : undefined;
  const token = parts.length > 2 && parts[2] ? decode(parts[2]) : undefined;
  return { identifier, token };
}

export function getSessionCookieValue(cookieString?: string) {
  const source = getCookieSource(cookieString);
  if (!source) return null;
  const cookies = source.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    if (!cookie) continue;
    const [name, ...rest] = cookie.split("=");
    if (name !== COOKIE_NAME) continue;
    return decode(rest.join("="));
  }
  return null;
}

export function hasActiveSession(cookieString?: string) {
  return !!parseSessionValue(cookieString)?.identifier;
}

export function getSessionIdentifier(cookieString?: string) {
  return parseSessionValue(cookieString)?.identifier ?? null;
}

export function getSessionToken(cookieString?: string) {
  return parseSessionValue(cookieString)?.token ?? null;
}
