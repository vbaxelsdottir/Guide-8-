import { Component, computed, effect, signal, OnInit, OnDestroy } from '@angular/core';
import { Calendar } from './components/calendar';
import { Countdown } from './components/countdown';
import { MovieEditor } from './components/movie-editor';
import type { Movie } from './movies';
import { getCalendarDate, getAvailableDay, isSimulated } from './date';
import { readOpenedDays, storageKey, readMovies, moviesKey } from './storage';

@Component({
  selector: 'app-root', standalone: true, imports: [Calendar, Countdown, MovieEditor],
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  date = signal(getCalendarDate());
  year = computed(() => this.date().getFullYear());
  availableDay = computed(() => getAvailableDay(this.date()));
  canEdit = computed(() => this.date().getMonth() < 11);
  today = computed(() => this.date().getMonth() === 11 ? this.date().getDate() : null);
  openDay = signal<number | null>(null);
  openedDays = signal(readOpenedDays(this.year()));
  movies = signal(readMovies(this.year()));
  editing = signal(false);
  movieMessage = signal('');
  saveError = signal('');
  storageFailed = signal(false);
  isSimulated = isSimulated;
  previewDate = computed(() => this.date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
  visibleDay = computed(() => {
    const day = this.openDay();
    return day !== null && day <= this.availableDay() ? day : null;
  });
  private timer?: number;

  constructor() {
    effect(() => {
      const days = this.openedDays();
      const year = this.year();
      try {
        localStorage.setItem(storageKey(year), JSON.stringify(days));
        this.storageFailed.set(false);
      } catch { this.storageFailed.set(true); }
    });
  }
  ngOnInit() { this.timer = window.setInterval(() => this.refreshDate(), 30_000); }
  ngOnDestroy() { window.clearInterval(this.timer); }

  private refreshDate() {
    const next = getCalendarDate();
    if (next.getFullYear() !== this.year()) {
      // Load the new season before the persistence effect runs.
      this.openedDays.set(readOpenedDays(next.getFullYear()));
      this.movies.set(readMovies(next.getFullYear()));
      this.openDay.set(null);
      this.editing.set(false);
      this.movieMessage.set('');
      this.saveError.set('');
    }
    this.date.set(next);
  }
  toggleDoor(day: number) {
    if (day > this.availableDay()) return;
    this.openDay.update(current => current === day ? null : day);
    this.openedDays.update(current => current.includes(day) ? current : [...current, day]);
  }
  startEditing() {
    this.editing.set(true);
    this.movieMessage.set('');
    this.saveError.set('');
  }
  saveMovies(nextMovies: Movie[]) {
    if (getCalendarDate().getMonth() === 11) {
      this.editing.set(false);
      this.movieMessage.set('Editing is closed for December. Your saved movies are unchanged.');
      return;
    }
    try {
      localStorage.setItem(moviesKey(this.year()), JSON.stringify(nextMovies));
      this.movies.set(nextMovies);
      this.editing.set(false);
      this.movieMessage.set('Movies saved in this browser. Your Christmas surprises are ready.');
    } catch {
      this.saveError.set('Your movies could not be saved. Check that browser storage is available and try again.');
    }
  }
}
