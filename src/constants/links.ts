export const NOTION_SURVIVAL_MAP_URL = "https://www.notion.so/replace-with-your-survival-map";

export const NOTION_SURVIVAL_MAP_URL_BY_LOCALE = {
  ko: "https://{notion-ko-url}",
  tw: "https://{notion-tw-url}",
} as const;

export function getNotionSurvivalMapUrl(locale: "ko" | "zh-TW" | "tw") {
  if (locale === "ko") return NOTION_SURVIVAL_MAP_URL_BY_LOCALE.ko;
  return NOTION_SURVIVAL_MAP_URL_BY_LOCALE.tw;
}
