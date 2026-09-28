import { Component, computed, input } from '@angular/core';
import { daysUntilChristmas } from '../date';

@Component({
  selector: 'app-countdown', standalone: true,
  template: `<div class="countdown"><span aria-hidden="true">✧</span>
    @if (days() === 0) {<span>Merry Christmas!</span>}
    @else {<span><strong>{{ days() }}</strong> {{ days() === 1 ? 'day' : 'days' }} until Christmas</span>}
  </div>`,
})
export class Countdown {
  date = input.required<Date>();
  days = computed(() => daysUntilChristmas(this.date()));
}
