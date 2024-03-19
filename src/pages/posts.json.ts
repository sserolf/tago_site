import type { AvailableLocales } from 'src/types/language';
import { getIgPosts } from 'src/utils/igPostsUtils';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitString = url.searchParams.get('limit') ? url.searchParams.get('limit') : undefined;
  const limit = limitString ? parseInt(limitString) : undefined;
  const locale = url.searchParams.get('locale') as AvailableLocales | undefined;
  const posts = await getIgPosts(locale, limit);
  return new Response(JSON.stringify(posts, null, 2));
}
