import type { AvailableLanguages, AvailableLocales } from 'src/types/language';
import locales from 'src/locales/locales';

export const getLocale = (language: AvailableLanguages) => {
  return locales[language] as AvailableLocales;
};
