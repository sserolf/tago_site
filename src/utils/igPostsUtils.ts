import { turso } from 'src/utils/turso';
import type { Children, ChildrenData, Post } from 'src/types/posts';
import type { AvailableLocales } from 'src/types/language';

export const getAllIgPosts = async (newUrl: string) => {
  const access_token: string = import.meta.env.IG_ACCESS_TOKEN as string;
  const url =
    // eslint-disable-next-line max-len
    'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband)%7Bmedia%7Bcaption%2Ctimestamp%2Cpermalink%2Cmedia_type%2Cmedia_url%2Cchildren%7Bmedia_url%2Cmedia_type%7D%7D%7D&access_token=' +
    access_token;
  const mediaData: Post[] = [];
  newUrl = newUrl !== '' ? newUrl : url;
  const response = await fetch(newUrl, {
    method: 'GET',
  });
  const data = await response.json();
  if (!data.error) {
    data.business_discovery.media.data.map((media: Post) => {
      mediaData.push(media);
    });
    // return mediaData as MediaDatum[];
    if (data.business_discovery.media.paging.cursors.after) {
      newUrl =
        // eslint-disable-next-line max-len
        'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband){media.after(' +
        data.business_discovery.media.paging.cursors.after +
        // eslint-disable-next-line max-len
        '){caption,timestamp,permalink,media_type,media_url,children{media_url,media_type}}}&access_token=' +
        access_token;
      const moreData = await getAllIgPosts(newUrl);
      mediaData.push(...moreData);
      return mediaData;
    } else {
      return mediaData;
    }
  } else {
    return [];
  }
};

export const getIgPosts = async (
  locale: AvailableLocales | undefined,
  limit: number | undefined,
) => {
  const lastUpdated = await fetchDbLastUpdated();
  const diff = Date.now() - parseInt(lastUpdated);
  const twelveHours = 1000 * 60 * 60 * 12;
  if (diff < twelveHours) {
    const posts = await fetchDbPosts(locale, limit);
    return { posts: posts, lastUpdated: lastUpdated };
  } else {
    const igPosts = await getAllIgPosts('');
    igPosts.map(async (post) => {
      const timestamp = new Date(post.timestamp).getTime().toString();
      const hasChildren =
        post.children && (post.children as Children).data.length > 0
          ? (post.children as Children).data.length.toString()
          : null;
      insertDbPost(post, timestamp, hasChildren);
      if (post.children)
        (post.children as Children).data.map(async (child) => {
          insertDbChild(child, post.id);
        });
    });
    updateLastUpdated();
    const posts = await fetchDbPosts(locale, limit);
    return {
      posts: posts,
      lastUpdated: Date.now().toString(),
    };
  }
};

const fetchDbPosts = async (locale: AvailableLocales | undefined, limit: number | undefined) => {
  let postsResult;
  if (limit) {
    postsResult = await turso.execute(
      `SELECT * FROM posts ORDER BY date_timestamp DESC LIMIT ${limit}`,
    );
  } else {
    postsResult = await turso.execute('SELECT * FROM posts ORDER BY date_timestamp DESC');
  }
  const posts = postsResult.rows;
  const children = await fetchDbChildren();
  const postsWithChildren: Post[] = [];
  locale &&
    posts.map((post) => {
      const newPost: Post = {} as Post;
      newPost.id = post.id as string;
      newPost.caption = post.caption as string;
      newPost.date_timestamp = post.date_timestamp as string;
      newPost.permalink = post.permalink as string;
      newPost.media_type = post.media_type as string;
      newPost.media_url = post.media_url as string;
      newPost.title = post.title as string;
      newPost.children = post.children !== null ? parseInt(post.children as string) : 0;
      newPost.dateToShow = new Date(parseInt(post.date_timestamp as string)).toLocaleDateString(
        locale.replace('_', '-'),
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
      );
      if (post.children) {
        newPost.children_elements = [];
        children.map((child) => {
          if (child.parentId === post.id) {
            newPost.children_elements.push(child as unknown as ChildrenData);
          }
        });
      }
      postsWithChildren.push(newPost);
    });
  return postsWithChildren;
};

const fetchDbChildren = async () => {
  const childrenResult = await turso.execute('SELECT * FROM children');
  const children = childrenResult.rows;
  return children;
};

const fetchDbLastUpdated = async () => {
  const lastUpdatedResult = await turso.execute('SELECT date FROM last_updated');
  const lastUpdated = lastUpdatedResult.rows[0].date as string;
  return lastUpdated;
};

const insertDbPost = async (post: Post, timestamp: string, hasChildren: string | null) => {
  await turso.execute({
    sql: 'INSERT OR IGNORE INTO posts (id, caption, date_timestamp, permalink, media_type, media_url, children, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [
      post.id!,
      post.caption ? post.caption : null,
      timestamp,
      post.permalink ? post.permalink : null,
      post.media_type ? post.media_type : null,
      post.media_url ? post.media_url : null,
      hasChildren,
      post.title ? post.title : null,
    ],
  });
};

const insertDbChild = async (child: ChildrenData, parentId: Post['id']) => {
  await turso.execute({
    sql: 'INSERT OR IGNORE INTO posts (id, parentId, media_type, media_url) VALUES (?, ?, ?, ?)',
    args: [
      child.id!,
      parentId!,
      child.media_type ? child.media_type : null,
      child.media_url ? child.media_url : null,
    ],
  });
};

const updateLastUpdated = async () => {
  await turso.execute({
    sql: 'UPDATE last_updated SET date = ?',
    args: [Date.now().toString()],
  });
};
