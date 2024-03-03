import { type IGPostsResponse, type MediaDatum } from '../types/posts';

export const getIgPostsData = async (newUrl: string, limit: number | undefined) => {
  const access_token =
    // eslint-disable-next-line max-len
    'EAAVXIL0flZBYBACjmDLyIPq0HtEiaYFXxDKxTScrdX8IZBhuUvWlupJPMCI73c96hkxgIZBxhAsl2Lz6fgBaD8ddOSX6gvxV8Jh9ZCobIJdn3YfHM6rR1qZAjs0REu4C0ZBmoZCRd2m2mbmrosiwaKZCF0EIY98Smg0A89rEMY1inDeiouBPBDva';
  const url = limit
    ? // eslint-disable-next-line max-len
      'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband)%7Bmedia.limit(' +
      limit +
      // eslint-disable-next-line max-len
      ')%7Bcaption%2Ctimestamp%2Cpermalink%2Cmedia_type%2Cmedia_url%2Cchildren%7Bmedia_url%2Cmedia_type%7D%7D%7D&access_token=' +
      access_token // eslint-disable-next-line max-len
    : 'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband)%7Bmedia%7Bcaption%2Ctimestamp%2Cpermalink%2Cmedia_type%2Cmedia_url%2Cchildren%7Bmedia_url%2Cmedia_type%7D%7D%7D&access_token=' +
      access_token;
  const mediaData: MediaDatum[] = [];
  newUrl = newUrl !== '' ? newUrl : url;
  const response = await fetch(newUrl, {
    method: 'GET',
  });
  const data = (await response.json()) as IGPostsResponse;
  if (!data.error) {
    data.business_discovery.media.data.map((media) => {
      mediaData.push(media);
    });
    return mediaData as MediaDatum[];
  }
  return [] as MediaDatum[];
};
