import { Component, input, output, signal, OnInit } from '@angular/core';
import type { Movie } from '../movies';

@Component({
  selector: 'app-movie-editor', standalone: true,
  template: `<form class="movie-editor" aria-labelledby="editor-title" (submit)="submit($event)">
    <h2 id="editor-title">Choose your Christmas movies</h2>
    <p>This list reveals every surprise. Changes stay in this browser and can be saved until November 30.</p>
    <div class="editor-grid">
      @for (movie of draft(); track movie.day) {
        <label><span>December {{ movie.day }}</span>
          <input #titleInput type="text" required maxlength="120" [value]="movie.title" (input)="updateTitle(movie.day, titleInput.value)"/>
        </label>
      }
    </div>
    @if (error() || saveError()) {<p role="alert">{{ error() || saveError() }}</p>}
    <div class="editor-actions"><button class="save-button" type="submit">Save movies</button><button class="secondary-button" type="button" (click)="cancel.emit()">Cancel</button></div>
  </form>`,
})
export class MovieEditor implements OnInit {
  movies = input.required<Movie[]>();
  saveError = input('');
  save = output<Movie[]>();
  cancel = output<void>();
  draft = signal<Movie[]>([]);
  error = signal('');

  ngOnInit() { this.draft.set(this.movies().map(movie => ({ ...movie }))); }
  updateTitle(day: number, title: string) {
    this.draft.update(current => current.map(movie => movie.day === day ? { ...movie, title } : movie));
  }
  submit(event: Event) {
    event.preventDefault();
    if (this.draft().some(movie => !movie.title.trim())) {
      this.error.set('Please enter a movie title for every day.');
      return;
    }
    this.error.set('');
    this.save.emit(this.draft().map(movie => ({ ...movie, title: movie.title.trim() })));
  }
}
