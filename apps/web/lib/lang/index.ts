// Add translation dictionary + types
import { english } from "./en";

export type Language = "en" | "es";
export type Dictionary = typeof english;

export const dictionary: Record<Language, Dictionary> = {
  en: english,
  es: english,
};
