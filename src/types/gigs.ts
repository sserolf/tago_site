export type Gig = {
  name: string;
  date: string;
  dateToShow?: string;
  url?: string;
};

export type GigsResponse = {
  upcomingGigs: Gig[];
  pastGigs: Gig[];
};
