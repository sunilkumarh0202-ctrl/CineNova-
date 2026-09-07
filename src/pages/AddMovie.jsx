import React, { useState } from 'react';
import { GENRES } from '../data/sampleData';
import { ArrowLeftIcon } from '../components/Icons';

export default function AddMovie({ editMovie, onSave, onCancel }) {
  const isEditing = Boolean(editMovie);

  const [title, setTitle] = useState(editMovie?.title || '');
  const [description, setDescription] = useState(editMovie?.description || '');
  const [poster, setPoster] = useState(editMovie?.poster || '');
  const [backdrop, setBackdrop] = useState(editMovie?.backdrop || '');
  const [videoUrl, setVideoUrl] = useState(editMovie?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [trailerUrl, setTrailerUrl] = useState(editMovie?.trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [genre, setGenre] = useState(editMovie?.genre || 'Sci-Fi');
  const [year, setYear] = useState(editMovie?.year || 2026);
  const [rating, setRating] = useState(editMovie?.rating || 8.5);
  const [duration, setDuration] = useState(editMovie?.duration || '2h 05m');
  const [language, setLanguage] = useState(editMovie?.language || 'English');
  const [director, setDirector] = useState(editMovie?.director || '');
  const [cast, setCast] = useState(Array.isArray(editMovie?.cast) ? editMovie.cast.join(', ') : (editMovie?.cast || ''));
  const [featured, setFeatured] = useState(Boolean(editMovie?.featured));
  const [trending, setTrending] = useState(Boolean(editMovie?.trending));

  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Movie title is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Description is required.');
      return;
    }

    const defaultPoster = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
    const defaultBackdrop = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80';

    const movieData = {
      ...(editMovie || {}),
      title: title.trim(),
      description: description.trim(),
      poster: poster.trim() || defaultPoster,
      backdrop: backdrop.trim() || defaultBackdrop,
      videoUrl: videoUrl.trim(),
      trailerUrl: trailerUrl.trim(),
      genre,
      year: Number(year) || new Date().getFullYear(),
      rating: Number(rating) || 7.0,
      duration: duration.trim() || '2h 00m',
      language: language.trim() || 'English',
      director: director.trim(),
      cast: cast.split(',').map(s => s.trim()).filter(Boolean),
      featured,
      trending,
    };

    onSave(movieData);
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onCancel}
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeftIcon size={18} /> Cancel & Return
      </button>

      <div className="form-card">
        <h2 className="font-display" style={{ fontSize: '2rem', marginBottom: '8px' }}>
          {isEditing ? 'Edit Authorized Movie' : 'Add Authorized Movie'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.92rem' }}>
          Register an authorized feature film into CineNova. All media must be verified as legally owned or licensed by the publisher.
        </p>

        {formError && (
          <div
            style={{
              backgroundColor: 'rgba(235, 75, 75, 0.15)',
              border: '1px solid rgba(235, 75, 75, 0.4)',
              color: '#ff9999',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              fontSize: '0.9rem',
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Title */}
          <div className="form-field form-grid-full">
            <label className="form-label" htmlFor="movie-title">Movie Title *</label>
            <input
              id="movie-title"
              type="text"
              required
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Last Light"
            />
          </div>

          {/* Description */}
          <div className="form-field form-grid-full">
            <label className="form-label" htmlFor="movie-desc">Description *</label>
            <textarea
              id="movie-desc"
              required
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Synopsis of the authorized motion picture..."
            />
          </div>

          {/* Poster URL */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-poster">Poster URL</label>
            <input
              id="movie-poster"
              type="url"
              className="form-input"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="https://example.com/poster.jpg (leave blank for demo fallback)"
            />
          </div>

          {/* Backdrop URL */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-backdrop">Backdrop URL</label>
            <input
              id="movie-backdrop"
              type="url"
              className="form-input"
              value={backdrop}
              onChange={(e) => setBackdrop(e.target.value)}
              placeholder="https://example.com/backdrop.jpg (leave blank for demo fallback)"
            />
          </div>

          {/* Video URL */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-videourl">Authorized Video URL (MP4 / HLS / WebM)</label>
            <input
              id="movie-videourl"
              type="url"
              required
              className="form-input"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://my-bucket.cdn.com/authorized-stream.mp4"
            />
          </div>

          {/* Trailer URL */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-trailerurl">Official Trailer URL</label>
            <input
              id="movie-trailerurl"
              type="url"
              className="form-input"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              placeholder="https://my-bucket.cdn.com/trailer.mp4"
            />
          </div>

          {/* Genre */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-genre">Genre</label>
            <select
              id="movie-genre"
              className="form-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.filter(g => g !== 'All').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-year">Release Year</label>
            <input
              id="movie-year"
              type="number"
              min="1900"
              max="2035"
              className="form-input"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          {/* Rating */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-rating">Rating (0 - 10)</label>
            <input
              id="movie-rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="form-input"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          {/* Duration */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-duration">Duration</label>
            <input
              id="movie-duration"
              type="text"
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2h 08m"
            />
          </div>

          {/* Language */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-lang">Language</label>
            <input
              id="movie-lang"
              type="text"
              className="form-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English"
            />
          </div>

          {/* Director */}
          <div className="form-field">
            <label className="form-label" htmlFor="movie-dir">Director</label>
            <input
              id="movie-dir"
              type="text"
              className="form-input"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="e.g. Helena Vance"
            />
          </div>

          {/* Cast */}
          <div className="form-field form-grid-full">
            <label className="form-label" htmlFor="movie-cast">Cast (Comma-separated)</label>
            <input
              id="movie-cast"
              type="text"
              className="form-input"
              value={cast}
              onChange={(e) => setCast(e.target.value)}
              placeholder="e.g. Kaelen Thorne, Lyra Mercer, Ramiro Sterling"
            />
          </div>

          {/* Checkboxes: Featured and Trending */}
          <div className="form-field form-grid-full" style={{ display: 'flex', gap: '30px', margin: '8px 0' }}>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
              />
              Feature this movie on the Homepage Hero banner
            </label>

            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => setTrending(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
              />
              Mark as Trending
            </label>
          </div>

          {/* Buttons */}
          <div className="form-grid-full" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Save Changes' : 'Publish Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
