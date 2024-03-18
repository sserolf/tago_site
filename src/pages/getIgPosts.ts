import type { Post, ChildrenData } from '../types/posts';
// import { getAllIgPostsImages, downloadIgImages, transformImages } from '../utils/igPostsUtils';
// const rootPath = process.cwd();
import igPostsJson from 'src/json/igPosts.json';
const igPosts: Post[] = igPostsJson.posts;

export async function GET() {
  const ids: object[] = [];
  igPosts.map((post: Post) => {
    if (post.children) {
      post.children.data.map((child: ChildrenData) => {
        ids.push({
          id: child.id,
          media_url: child.media_url,
        });
      });
    } else {
      if (post.id && post.media_url)
        ids.push({
          id: post.id,
          media_url: post.media_url,
        });
    }
  });
  return new Response(JSON.stringify({ result: ids }));
  // const lastDate = igPosts.lastDate as number;
  // const currentTimestamp = Date.now();
  // const diff = (currentTimestamp - lastDate) as number;
  // const thirtySeconds = 1000 * 30;
  // const twelveHours = 1000 * 60 * 60 * 12;
  // if (diff < thirtySeconds || diff > twelveHours || import.meta.env.MODE === 'development') {
  //   const images: Post[] = (await getAllIgPostsImages('')) as Post[];
  //   const transform = await downloadIgImages(images);
  //   if (transform) {
  //     const transformedImages: string[] = await transformImages('', true);
  //     const transformedIgImages: string[] = await transformImages(
  //       `${rootPath}/to_compress/ig`,
  //       false,
  //     );
  //     return new Response(JSON.stringify({ transformedImages, transformedIgImages }));
  //   }
  // } else {
  //   return new Response(JSON.stringify('no ha pasao un minuto, surmano'));
  // }
}
