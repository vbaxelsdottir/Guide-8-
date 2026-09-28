import { Component, computed, input, output } from '@angular/core';
import type { Movie } from '../movies';

@Component({
  selector: 'app-calendar-door', standalone: true,
  styles: [':host { display: block; min-width: 0; }'],
  template: `
    <button [class]="'door tone-' + movie().day % 4" [class.is-open]="isOpen()" [class.is-today]="isToday()"
      type="button" [disabled]="locked()" [attr.aria-pressed]="isOpen()" [attr.aria-label]="label()" (click)="toggle.emit(movie().day)">
      <span class="door-inner">
        <span class="door-face door-front" aria-hidden="true">
          <span class="door-top">{{ isToday() ? 'TODAY' : 'DECEMBER' }}</span>
          <span class="door-number">{{ dayNumber() }}</span>
          <span class="door-symbol">{{ symbols[movie().day % 4] }}</span>
          <span class="door-status">@if (locked()) {<span class="lock"></span> Locked} @else {{{ opened() ? '✓ Opened' : 'Open door' }}}</span>
        </span>
        <span class="door-face door-back" [attr.aria-hidden]="!isOpen()">
          @if (isOpen()) {
            <span class="door-top">DECEMBER {{ movie().day }}</span><span class="movie-star" aria-hidden="true">✦</span>
            <span class="movie-title">{{ movie().title }}</span><span class="door-status">Enjoy your movie night</span>
          }
        </span>
      </span>
    </button>
  `,
})
export class CalendarDoor {
  movie = input.required<Movie>();
  locked = input.required<boolean>();
  opened = input.required<boolean>();
  isOpen = input.required<boolean>();
  isToday = input.required<boolean>();
  toggle = output<number>();
  symbols = ['✧', '✶', '❋', '✦'];
  dayNumber = computed(() => String(this.movie().day).padStart(2, '0'));
  state = computed(() => this.locked() ? 'Locked' : this.opened() ? 'Opened' : 'Available');
  label = computed(() => `December ${this.movie().day}, ${this.state()}${this.isOpen() ? `: ${this.movie().title}. Click to close` : ''}`);
}
