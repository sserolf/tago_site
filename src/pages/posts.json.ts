import type { AvailableLanguages, AvailableLocales } from 'src/types/language';
import { getIgPosts } from 'src/utils/igPostsUtils';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const language = url.searchParams.get('language')?.toUpperCase() as
    | AvailableLanguages
    | undefined;
  let locale: AvailableLocales = 'es_ES';
  if (language && language.length === 2) {
    const languageLowerCase = language.toLowerCase();
    const languageUpperCase = language.toUpperCase();
    locale = `${languageLowerCase}_${languageUpperCase}` as AvailableLocales;
  }
  const limitString = url.searchParams.get('limit') ? url.searchParams.get('limit') : undefined;
  const limit = limitString ? parseInt(limitString) : undefined;
  const posts = await getIgPosts(locale, limit);
  return new Response(JSON.stringify(posts, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
