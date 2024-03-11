export interface Post {
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
  data: ChildrenData[];
}

export interface ChildrenData {
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
