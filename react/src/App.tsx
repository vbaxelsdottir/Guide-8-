import { useEffect, useState } from 'react';
import { MovieEditor } from './components/MovieEditor';
import type { Movie } from './movies';
import { Calendar } from './components/Calendar';
import { Countdown } from './components/Countdown';
import { getAvailableDay, getCalendarDate, isSimulated } from './date';
import { readOpenedDays, storageKey, readMovies, moviesKey } from './storage';

export default function App() {
  const [date, setDate] = useState(getCalendarDate);
  const year = date.getFullYear();
  // Remount the calendar on a year change so each December has its own history.
  useEffect(() => {
    const timer = window.setInterval(() => setDate(getCalendarDate()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <AdventCalendar key={year} date={date}/>;
}

function AdventCalendar({ date }: { date: Date }) {
  const year = date.getFullYear();
  const availableDay = getAvailableDay(date);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openedDays, setOpenedDays] = useState<number[]>(() => readOpenedDays(year));
  const [movies, setMovies] = useState(() => readMovies(year));
  const [editing, setEditing] = useState(false);
  const [movieMessage, setMovieMessage] = useState('');
  const canEdit = date.getMonth() < 11;
  const [storageFailed, setStorageFailed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(year), JSON.stringify(openedDays));
      setStorageFailed(false);
    } catch {
      setStorageFailed(true);
    }
  }, [openedDays, year]);

  function saveMovies(nextMovies: Movie[]): boolean {
    // Recheck the date when saving, including a form left open at midnight.
    if (getCalendarDate().getMonth() === 11) {
      setEditing(false);
      setMovieMessage('Editing is closed for December. Your saved movies are unchanged.');
      return false;
    }
    try {
      localStorage.setItem(moviesKey(year), JSON.stringify(nextMovies));
      setMovies(nextMovies);
      setEditing(false);
      setMovieMessage('Movies saved in this browser. Your Christmas surprises are ready.');
      return true;
    } catch {
      return false;
    }
  }

  function toggleDoor(day: number) {
    if (day > availableDay) return;
    setOpenDay(current => current === day ? null : day);
    setOpenedDays(current => current.includes(day) ? current : [...current, day]);
  }

  return <main>
    <header className="masthead"><span className="brand"><span aria-hidden="true">✳</span> THE CHRISTMAS COLLECTION</span><span className="edition">DECEMBER · {year}</span></header>
    <section className="intro" aria-labelledby="page-title">
      <p className="eyebrow">24 DOORS. 24 MOVIE NIGHTS.</p>
      <h1 id="page-title">A very merry<br/><em>movie countdown.</em></h1>
      <p className="intro-copy">Get cozy. Pick a door. Let a little Christmas magic in.</p>
      <Countdown date={date}/>
    </section>
    <section className="calendar-section" aria-label="Christmas movie advent calendar">
      <div className="calendar-heading"><div><h2>Your advent calendar</h2><p>One surprise a day, December 1–24.</p></div><div className="legend"><span><i className="available-dot"/> Available</span><span>✓ Opened</span><span><i className="lock"/> Locked</span></div></div>
      <div className="movie-settings">
        <p>{canEdit ? 'Make it your own: choose your movies before December 1.' : 'The movie list is set. Editing is closed during December.'}</p>
        {canEdit && !editing && <button className="secondary-button" onClick={() => { setEditing(true); setMovieMessage(''); }}>Edit movies</button>}
      </div>
      {editing && canEdit && <MovieEditor movies={movies} onSave={saveMovies} onCancel={() => setEditing(false)}/>}
      {movieMessage && <p role="status">{movieMessage}</p>}
      <Calendar movies={movies} availableDay={availableDay} today={date.getMonth() === 11 ? date.getDate() : null}
        openDay={openDay !== null && openDay <= availableDay ? openDay : null} openedDays={openedDays} onToggle={toggleDoor}/>
      <div className="calendar-foot"><span>{openedDays.length} of 24 surprises discovered</span><span>Good films. Warm blankets. Christmas together.</span></div>
      {storageFailed && <p role="status">Your browser couldn’t save opened days. You can still use the calendar.</p>}
    </section>
    <footer><span aria-hidden="true">✧</span> A little tradition. A lot of Christmas.</footer>
    {isSimulated && <p className="development-note">Development preview · December {date.getDate()} · Set DEVELOPMENT_DAY to null in src/date.ts to use today.</p>}
  </main>;
}
