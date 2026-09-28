import { useState, type FormEvent } from 'react';
import type { Movie } from '../movies';

type Props = { movies: Movie[]; onSave: (movies: Movie[]) => boolean; onCancel: () => void };

export function MovieEditor({ movies, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState(() => movies.map(movie => ({ ...movie })));
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.some(movie => !movie.title.trim())) {
      setError('Please enter a movie title for every day.');
      return;
    }
    if (!onSave(draft.map(movie => ({ ...movie, title: movie.title.trim() })))) {
      setError('Your movies could not be saved. Check that browser storage is available and try again.');
    }
  }

  return <form className="movie-editor" onSubmit={submit} aria-labelledby="editor-title">
    <h2 id="editor-title">Choose your Christmas movies</h2>
    <p>This list reveals every surprise. Changes stay in this browser and can be saved until November 30.</p>
    <div className="editor-grid">{draft.map(movie => <label key={movie.day}>
      <span>December {movie.day}</span>
      <input type="text" required maxLength={120} value={movie.title}
        onChange={event => setDraft(current => current.map(item => item.day === movie.day ? { ...item, title: event.target.value } : item))}/>
    </label>)}</div>
    {error && <p role="alert">{error}</p>}
    <div className="editor-actions"><button className="save-button" type="submit">Save movies</button><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}
