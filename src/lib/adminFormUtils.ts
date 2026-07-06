export const OTHER_LANGUAGE = "__other__";

export function resolveLanguage(language: string, newLanguage: string | undefined): string {
  return language === OTHER_LANGUAGE ? (newLanguage ?? "").trim() : language;
}
