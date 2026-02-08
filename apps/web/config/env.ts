export const sanitizeUrl = (url: string) => url.replace(/\/+$/, "");

const defaultWsUrl = process.env.PUBLIC_MOODLE_BASE_URL ?? ""; // moodle webservice URL, defaulting to '/api' for relative path in development and production when not set. In Tauri, this should be set to the actual backend URL (e.g., 'http://localhost:3000') since relative paths won't work.

const baseApiUrl = sanitizeUrl(defaultWsUrl);

export const envConfig = {
  WS_API_URL: baseApiUrl,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
