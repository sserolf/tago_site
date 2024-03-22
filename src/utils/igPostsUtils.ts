import { turso } from 'src/utils/turso';
import type { Children, ChildrenData, Post, PostsDbResponse, PostsResponse } from 'src/types/posts';
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
    updateDbPosts();
    const posts = await fetchDbPosts(locale, limit);
    return {
      posts: posts,
      lastUpdated: Date.now().toString(),
    };
  }
};

const fetchDbPosts = async (locale: AvailableLocales | undefined, limit: number | undefined) => {
  const postsResult = await turso.execute(
    // eslint-disable-next-line max-len
    `SELECT post.id, post.caption, post.date_timestamp, post.permalink, post.media_type, post.media_url, post.title, children.id AS children_id, children.media_type AS children_media_type, children.media_url AS children_media_url FROM (SELECT * FROM posts${limit ? ' ORDER BY date_timestamp DESC LIMIT ' + limit : ''}) as post LEFT JOIN children ON post.id = children.parentId${limit ? '' : ' ORDER BY post.date_timestamp DESC'}`,
  );
  const posts = postsResult.rows as unknown as PostsDbResponse[];
  const result: PostsResponse[] = [];

  posts.forEach((post) => {
    const existingPost = result.find((obj) => post.id === obj.id);
    if (existingPost) {
      existingPost.children.push({
        id: post.children_id,
        media_type: post.children_media_type,
        media_url: post.children_media_url,
      });
    } else {
      const dateToShowOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      let childrenResult: PostsResponse['children'];
      if (post.children_id) {
        childrenResult = [
          {
            id: post.children_id,
            media_type: post.children_media_type,
            media_url: post.children_media_url,
          },
        ];
      } else childrenResult = [];
      result.push({
        id: post.id,
        caption: post.caption,
        date_timestamp: post.date_timestamp,
        dateToShow: locale
          ? new Date(parseInt(post.date_timestamp as string)).toLocaleDateString(
              locale.replace('_', '-'),
              dateToShowOptions,
            )
          : new Date(parseInt(post.date_timestamp as string)).toLocaleDateString(
              'es-ES',
              dateToShowOptions,
            ),
        permalink: post.permalink,
        media_type: post.media_type,
        media_url: post.media_url,
        children: childrenResult,
        title: post.title,
      });
    }
  });
  return result;
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
  await turso.execute({
    sql: 'UPDATE posts SET media_url = ? WHERE id = ?',
    args: [post.media_url ? post.media_url : null, post.id!],
  });
};

const insertDbChild = async (child: ChildrenData, parentId: Post['id']) => {
  await turso.execute({
    sql: 'INSERT OR IGNORE INTO children (id, parentId, media_type, media_url) VALUES (?, ?, ?, ?)',
    args: [
      child.id!,
      parentId!,
      child.media_type ? child.media_type : null,
      child.media_url ? child.media_url : null,
    ],
  });
  await turso.execute({
    sql: 'UPDATE children SET media_url = ? WHERE id = ?',
    args: [child.media_url ? child.media_url : null, child.id!],
  });
};

const updateLastUpdated = async () => {
  await turso.execute({
    sql: 'UPDATE last_updated SET date = ?',
    args: [Date.now().toString()],
  });
};

export const updateDbPosts = async () => {
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
  return 'Database updated';
};
