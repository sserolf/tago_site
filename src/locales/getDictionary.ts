import type { AvailableLanguages } from '../types/language';
import languages from './languages';

export const getDictionary = (language: AvailableLanguages) => {
  return languages[language];
};
