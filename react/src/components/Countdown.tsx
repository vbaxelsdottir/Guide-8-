import { daysUntilChristmas } from '../date';

export function Countdown({ date }: { date: Date }) {
  const days = daysUntilChristmas(date);
  return <div className="countdown"><span aria-hidden="true">✧</span>{days === 0
    ? <span>Merry Christmas!</span>
    : <span><strong>{days}</strong> {days === 1 ? 'day' : 'days'} until Christmas</span>}</div>;
}
