import type { Post } from '../types/posts';
import { getAllIgPostsImages, downloadIgImages, transformImages } from '../utils/igPostsUtils';
import igPosts from '../../public/json/igPosts.json';

export async function GET() {
  const lastDate = igPosts.lastDate as number;
  const currentTimestamp = Date.now();
  const diff = (currentTimestamp - lastDate) as number;
  const thirtySeconds = 1000 * 30;
  const twelveHours = 1000 * 60 * 60 * 12;
  if (diff < thirtySeconds || diff > twelveHours || import.meta.env.MODE === 'development') {
    const images: Post[] = (await getAllIgPostsImages('')) as Post[];
    const transform = await downloadIgImages(images);
    if (transform) {
      const transformedImages: string[] = await transformImages('', true);
      const transformedIgImages: string[] = await transformImages('to_compress/ig', false);
      return {
        transformedImages: JSON.stringify(transformedImages),
        transformedIgImages: JSON.stringify(transformedIgImages),
      };
    }
  } else {
    return new Response('no ha pasao un minuto, surmano');
  }
}
