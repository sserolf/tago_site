export const getAllIgPostsData = async (access_token, newUrl, apply4Limit) => {
  const url = apply4Limit
    ? // eslint-disable-next-line max-len
      'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband)%7Bmedia.limit(4)%7Bcaption%2Ctimestamp%2Cpermalink%2Cmedia_type%2Cmedia_url%2Cchildren%7Bmedia_url%2Cmedia_type%7D%7D%7D&access_token=' +
      access_token // eslint-disable-next-line max-len
    : 'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband)%7Bmedia%7Bcaption%2Ctimestamp%2Cpermalink%2Cmedia_type%2Cmedia_url%2Cchildren%7Bmedia_url%2Cmedia_type%7D%7D%7D&access_token=' +
      access_token;
  const mediaData = [];
  newUrl = newUrl !== '' ? newUrl : url;
  const response = await fetch(newUrl, {
    method: 'GET',
  });
  const data = await response.json();
  if (!data.error) {
    data.business_discovery.media.data.map((media) => {
      mediaData.push(media);
    });
    // return mediaData as MediaDatum[];
    if (data.business_discovery.media.paging.cursors.after) {
      newUrl =
        // eslint-disable-next-line max-len
        'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband)%7Bmedia.after(' +
        data.business_discovery.media.paging.cursors.after +
        // eslint-disable-next-line max-len
        ')%7Bcaption%2Ctimestamp%2Cpermalink%2Cmedia_type%2Cmedia_url%2Cchildren%7Bmedia_url%2Cmedia_type%7D%7D%7D&access_token=' +
        access_token;
      const moreData = await getAllIgPostsData(access_token, newUrl, false);
      mediaData.push(...moreData);
      return mediaData;
    } else {
      return mediaData;
    }
  }
  return [];
};
