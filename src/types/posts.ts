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
  children_elements: ChildrenData[];
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
