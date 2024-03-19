import { type AvailableLocales } from 'src/types/language';
import { type Gig } from 'src/types/gigs';
import { turso } from 'src/utils/turso';

export const getGigs = async (locale: AvailableLocales | undefined) => {
  const { rows } = await turso.execute('SELECT * FROM gigs ORDER BY date DESC');
  const gigsQuery = rows as unknown as Gig[];
  const upcomingGigs: Gig[] = [];
  const pastGigs: Gig[] = [];
  locale &&
    gigsQuery.map((gig: Gig) => {
      if (parseInt(gig.date) < new Date().getTime()) {
        gig.dateToShow = new Date(parseInt(gig.date)).toLocaleDateString(locale.replace('_', '-'), {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });
        pastGigs.push(gig);
      } else {
        gig.dateToShow = new Date(parseInt(gig.date)).toLocaleDateString(locale.replace('_', '-'), {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        });
        upcomingGigs.push(gig);
        upcomingGigs.reverse();
      }
    });
  const gigs = locale ? { upcomingGigs: upcomingGigs, pastGigs: pastGigs } : gigsQuery;
  return gigs;
};
