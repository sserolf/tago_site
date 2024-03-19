import type { AvailableLocales } from 'src/types/language';
import { getGigs } from 'src/utils/gigsUtils';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') as AvailableLocales | undefined;
  const gigs = await getGigs(locale);
  return new Response(JSON.stringify({ gigs: gigs }, null, 2));
}
