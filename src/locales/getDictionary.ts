import type { AvailableLanguages } from 'src/types/language';
import languages from 'src/locales/languages';

export const getDictionary = (language: AvailableLanguages) => {
  return languages[language];
};
