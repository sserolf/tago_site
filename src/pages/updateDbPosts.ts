import { updateDbPosts } from 'src/utils/igPostsUtils';

export async function GET() {
  const res = await updateDbPosts();
  return new Response(JSON.stringify({ response: res }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
