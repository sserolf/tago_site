export interface Post {
  caption?: string;
  timestamp: string;
  permalink?: string;
  media_type?: string;
  media_url?: string;
  id?: string;
  children?: Children;
  title?: string;
  aspect_ratio?: string;
}

export interface Children {
  data: ChildrenData[];
}

export interface ChildrenData {
  media_type: string;
  media_url: string;
  id: string;
  aspect_ratio?: string;
}
