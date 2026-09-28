import { Component, input, output } from '@angular/core';
import type { Movie } from '../movies';
import { CalendarDoor } from './calendar-door';

@Component({
  selector: 'app-calendar', standalone: true, imports: [CalendarDoor],
  template: `<div class="calendar-grid">
    @for (movie of movies(); track movie.day) {
      <app-calendar-door [movie]="movie" [locked]="movie.day > availableDay()"
        [opened]="openedDays().includes(movie.day)" [isOpen]="openDay() === movie.day"
        [isToday]="today() === movie.day" (toggle)="toggle.emit($event)"/>
    }
  </div>`,
})
export class Calendar {
  movies = input.required<Movie[]>();
  availableDay = input.required<number>();
  today = input.required<number | null>();
  openedDays = input.required<number[]>();
  openDay = input.required<number | null>();
  toggle = output<number>();
}
