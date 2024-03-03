import type { AvailableLanguages, AvailableLocales } from '../types/language';
import locales from './locales';

export const getLocale = (language: AvailableLanguages) => {
  return locales[language] as AvailableLocales;
};
