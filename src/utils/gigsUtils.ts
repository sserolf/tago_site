import { type AvailableLocales } from 'src/types/language';
import { type Gig } from 'src/types/gigs';
import { turso } from 'src/utils/turso';

export const getGigs = async (locale: AvailableLocales | undefined, limit: number | undefined) => {
  const now = Date.now();
  const { rows } = await turso.execute(
    `SELECT * FROM gigs WHERE date > ${now}
    UNION
    SELECT * FROM (SELECT * FROM gigs WHERE date <= ${now}
    ORDER BY date DESC${limit ? ` LIMIT ${limit}` : ''})`,
  );
  const gigsQuery = rows as unknown as Gig[];
  const upcomingGigs: Gig[] = [];
  const upcomingGigsDateFormat: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };
  const pastGigs: Gig[] = [];
  const pastGigsDateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  const newLocale = locale ? locale : 'es-ES';
  gigsQuery.map((gig: Gig) => {
    if (parseInt(gig.date) < new Date().getTime()) {
      gig.dateToShow = new Date(parseInt(gig.date)).toLocaleDateString(
        newLocale.replace('_', '-'),
        upcomingGigsDateFormat,
      );
      pastGigs.push(gig);
      pastGigs.sort((a, b) => {
        return parseInt(b.date) - parseInt(a.date);
      });
    } else {
      gig.dateToShow = new Date(parseInt(gig.date)).toLocaleDateString(
        newLocale.replace('_', '-'),
        pastGigsDateFormat,
      );
      upcomingGigs.push(gig);
      upcomingGigs.sort((a, b) => {
        return parseInt(a.date) - parseInt(b.date);
      });
    }
  });
  const gigs = { upcomingGigs: upcomingGigs, pastGigs: pastGigs };
  return gigs;
};
