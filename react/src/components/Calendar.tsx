import type { Movie } from '../movies';
import { CalendarDoor } from './CalendarDoor';

type Props = { movies: Movie[]; availableDay: number; today: number | null; openedDays: number[]; openDay: number | null; onToggle: (day: number) => void };

export function Calendar({ movies, availableDay, today, openedDays, openDay, onToggle }: Props) {
  return <div className="calendar-grid">{movies.map(movie => (
    <CalendarDoor key={movie.day} movie={movie} locked={movie.day > availableDay}
      opened={openedDays.includes(movie.day)} isOpen={openDay === movie.day}
      isToday={today === movie.day} onToggle={onToggle}/>
  ))}</div>;
}
