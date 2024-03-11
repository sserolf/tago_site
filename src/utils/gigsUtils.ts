import { type Gig } from '../types/gigs';

export const splitGigs = (gigs: Gig[]) => {
  const upcomingGigs: Gig[] = [];
  const pastGigs: Gig[] = [];
  gigs.map((gig) => {
    const dateString = gig.date;
    const [month, day, year] = dateString.split('/');
    const date = new Date();
    date.setDate(Number(day));
    date.setMonth(Number(month) - 1);
    date.setFullYear(Number(year));

    date.getTime() < new Date().getTime() ? pastGigs.push(gig) : upcomingGigs.push(gig);
  });
  return { upcomingGigs: upcomingGigs, pastGigs: pastGigs };
};

const transformInDate = (date: Gig['date']) => {
  const [month, day, year] = date.split('/');
  const newDate = new Date();
  newDate.setDate(Number(day));
  newDate.setMonth(Number(month) - 1);
  newDate.setFullYear(Number(year));
  return newDate;
};

export const sortGigs = (gigs: Gig[], type: string) => {
  const sortedGigs = gigs.sort((a, b) => {
    const dateA = transformInDate(a.date);
    const dateB = transformInDate(b.date);
    if (type === 'past') {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });
  return sortedGigs;
};

export const formatPastGigsDates = (gigs: Gig[], locale: string) => {
  const sortedData = sortGigs(gigs, 'past');
  sortedData.map((gig) => {
    gig.dateToShow = new Date(gig.date).toLocaleDateString(locale.replace('_', '-'), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  });
  return sortedData;
};

export const formatUpcomingGigsDates = (gigs: Gig[], locale: string) => {
  const sortedData = sortGigs(gigs, 'upcoming');
  sortedData.map((gig) => {
    gig.dateToShow = new Date(gig.date).toLocaleDateString(locale.replace('_', '-'), {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  });
  return sortedData;
};
