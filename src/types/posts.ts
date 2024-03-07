export interface IGPostsResponse {
  business_discovery: BusinessDiscovery;
  id: string;
  error: Error;
}

export interface BusinessDiscovery {
  media: Media;
  id: string;
}

export interface Media {
  data: MediaDatum[];
  paging: Paging;
}

export interface MediaDatum {
  caption?: string;
  timestamp: string;
  permalink?: string;
  media_type?: MediaType;
  media_url: string;
  id?: string;
  children?: Children;
  title?: string;
  aspect_ratio?: string;
}

export interface Children {
  data: ChildrenDatum[];
}

export interface ChildrenDatum {
  media_url: string;
  media_type: MediaType;
  id: string;
  aspect_ratio?: string;
}

export enum MediaType {
  CarouselAlbum = 'CAROUSEL_ALBUM',
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export interface Paging {
  cursors: Cursors;
}

export interface Cursors {
  after: string;
}

export interface Error {
  message: string;
  type: string;
  is_transient: boolean;
  code: number;
  fbtrace_id: string;
}
