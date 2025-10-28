import commonEn from "@/locales/en/common.json";
import commonSq from "@/locales/sq/common.json";

export const resources = {
  en: {
    common: commonEn,
  },
  sq: {
    common: commonSq,
  },
};

export type SupportedLocales = keyof typeof resources;
