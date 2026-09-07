import React, { useState } from 'react';
import { GENRES } from '../data/sampleData';
import { ArrowLeftIcon } from '../components/Icons';

export default function AddSeries({ editSeries, onSave, onCancel }) {
  const isEditing = Boolean(editSeries);

  const [title, setTitle] = useState(editSeries?.title || '');
  const [description, setDescription] = useState(editSeries?.description || '');
  const [poster, setPoster] = useState(editSeries?.poster || '');
  const [backdrop, setBackdrop] = useState(editSeries?.backdrop || '');
  const [trailerUrl, setTrailerUrl] = useState(editSeries?.trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [genre, setGenre] = useState(editSeries?.genre || 'Fantasy');
  const [year, setYear] = useState(editSeries?.year || 2026);
  const [rating, setRating] = useState(editSeries?.rating || 8.8);
  const [language, setLanguage] = useState(editSeries?.language || 'English');
  const [director, setDirector] = useState(editSeries?.director || '');
  const [cast, setCast] = useState(Array.isArray(editSeries?.cast) ? editSeries.cast.join(', ') : (editSeries?.cast || ''));
  const [seasonsCount, setSeasonsCount] = useState(editSeries?.seasonsCount || 1);
  const [featured, setFeatured] = useState(Boolean(editSeries?.featured));
  const [trending, setTrending] = useState(Boolean(editSeries?.trending));

  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Series title is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Description is required.');
      return;
    }

    const defaultPoster = 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80';
    const defaultBackdrop = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80';

    const seriesData = {
      ...(editSeries || {}),
      title: title.trim(),
      description: description.trim(),
      poster: poster.trim() || defaultPoster,
      backdrop: backdrop.trim() || defaultBackdrop,
      trailerUrl: trailerUrl.trim(),
      genre,
      year: Number(year) || new Date().getFullYear(),
      rating: Number(rating) || 8.0,
      language: language.trim() || 'English',
      director: director.trim(),
      cast: cast.split(',').map(s => s.trim()).filter(Boolean),
      seasonsCount: Number(seasonsCount) || 1,
      episodesCount: editSeries?.episodesCount || 0,
      featured,
      trending,
    };

    onSave(seriesData);
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
          {isEditing ? 'Edit Web Series' : 'Add New Web Series'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.92rem' }}>
          Register an authorized episodic web series. After saving, you will be able to manage seasons and upload individual episode video streams.
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
            <label className="form-label" htmlFor="series-title">Series Title *</label>
            <input
              id="series-title"
              type="text"
              required
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chronicles of Aethelgard"
            />
          </div>

          {/* Description */}
          <div className="form-field form-grid-full">
            <label className="form-label" htmlFor="series-desc">Synopsis / Series Arc *</label>
            <textarea
              id="series-desc"
              required
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of the serialized narrative..."
            />
          </div>

          {/* Poster URL */}
          <div className="form-field">
            <label className="form-label" htmlFor="series-poster">Poster URL</label>
            <input
              id="series-poster"
              type="url"
              className="form-input"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="https://example.com/poster.jpg (leave blank for demo fallback)"
            />
          </div>

          {/* Backdrop URL */}
          <div className="form-field">
            <label className="form-label" htmlFor="series-backdrop">Backdrop Artwork URL</label>
            <input
              id="series-backdrop"
              type="url"
              className="form-input"
              value={backdrop}
              onChange={(e) => setBackdrop(e.target.value)}
              placeholder="https://example.com/backdrop.jpg (leave blank for demo fallback)"
            />
          </div>

          {/* Trailer URL */}
          <div className="form-field form-grid-full">
            <label className="form-label" htmlFor="series-trailerurl">Official Series Trailer URL</label>
            <input
              id="series-trailerurl"
              type="url"
              className="form-input"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              placeholder="https://my-bucket.cdn.com/series-trailer.mp4"
            />
          </div>

          {/* Genre */}
          <div className="form-field">
            <label className="form-label" htmlFor="series-genre">Genre</label>
            <select
              id="series-genre"
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
            <label className="form-label" htmlFor="series-year">Debut Year</label>
            <input
              id="series-year"
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
            <label className="form-label" htmlFor="series-rating">Rating (0 - 10)</label>
            <input
              id="series-rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="form-input"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          {/* Seasons Count */}
          <div className="form-field">
            <label className="form-label" htmlFor="series-seasons">Total Seasons</label>
            <input
              id="series-seasons"
              type="number"
              min="1"
              max="30"
              className="form-input"
              value={seasonsCount}
              onChange={(e) => setSeasonsCount(e.target.value)}
            />
          </div>

          {/* Language */}
          <div className="form-field">
            <label className="form-label" htmlFor="series-lang">Language</label>
            <input
              id="series-lang"
              type="text"
              className="form-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English"
            />
          </div>

          {/* Director */}
          <div className="form-field">
            <label className="form-label" htmlFor="series-dir">Showrunner / Director</label>
            <input
              id="series-dir"
              type="text"
              className="form-input"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="e.g. Gareth Holm"
            />
          </div>

          {/* Cast */}
          <div className="form-field form-grid-full">
            <label className="form-label" htmlFor="series-cast">Lead Cast (Comma-separated)</label>
            <input
              id="series-cast"
              type="text"
              className="form-input"
              value={cast}
              onChange={(e) => setCast(e.target.value)}
              placeholder="e.g. Thorin Vane, Lady Astrid, Lord Kieran"
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
              Feature this series on the CineNova landing hero
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
              {isEditing ? 'Save Series Changes' : 'Create Web Series'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
