export interface Post {
  caption?: string;
  date_timestamp: string;
  dateToShow?: string;
  timestamp: string;
  permalink?: string;
  media_type?: string;
  media_url?: string;
  id?: string;
  children?: Children | number;
  title?: string;
}

export interface Children {
  data: ChildrenData[];
}

export interface ChildrenData {
  media_type: string;
  media_url: string;
  id: string;
  parentId: string;
}

export interface PostsDbResponse {
  id: string | null;
  caption: string | null;
  date_timestamp: string;
  permalink: string | null;
  media_type: string | null;
  media_url: string | null;
  title: string | null;
  children_id: string | null;
  children_media_type: string | null;
  children_media_url: string | null;
}

export interface PostsResponse {
  id: string | null;
  caption: string | null;
  date_timestamp: string;
  dateToShow: string | null;
  permalink: string | null;
  media_type: string | null;
  media_url: string | null;
  children: Child[];
  title: string | null;
}

export interface Child {
  id: string | null;
  media_type: string | null;
  media_url: string | null;
}
