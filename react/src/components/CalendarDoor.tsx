import type { Movie } from '../movies';

type Props = {
  movie: Movie;
  locked: boolean;
  opened: boolean;
  isOpen: boolean;
  isToday: boolean;
  onToggle: (day: number) => void;
};

export function CalendarDoor({ movie, locked, opened, isOpen, isToday, onToggle }: Props) {
  const state = locked ? 'Locked' : opened ? 'Opened' : 'Available';
  return (
    <button className={`door tone-${movie.day % 4}${isOpen ? ' is-open' : ''}${isToday ? ' is-today' : ''}`}
      type="button" disabled={locked} aria-pressed={isOpen}
      aria-label={`December ${movie.day}, ${state}${isOpen ? `: ${movie.title}. Click to close` : ''}`}
      onClick={() => onToggle(movie.day)}>
      <span className="door-inner">
        <span className="door-face door-front" aria-hidden="true">
          <span className="door-top">{isToday ? 'TODAY' : 'DECEMBER'}</span>
          <span className="door-number">{String(movie.day).padStart(2, '0')}</span>
          <span className="door-symbol">{['✧', '✶', '❋', '✦'][movie.day % 4]}</span>
          <span className="door-status">{locked ? <><span className="lock"/> Locked</> : opened ? '✓ Opened' : 'Open door'}</span>
        </span>
        <span className="door-face door-back" aria-hidden={!isOpen}>
          {isOpen && <><span className="door-top">DECEMBER {movie.day}</span><span className="movie-star" aria-hidden="true">✦</span><span className="movie-title">{movie.title}</span><span className="door-status">Enjoy your movie night</span></>}
        </span>
      </span>
    </button>
  );
}
