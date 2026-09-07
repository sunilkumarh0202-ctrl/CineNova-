import React, { useState } from 'react';
import { GENRES } from '../data/sampleData';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';

export default function Genres({ movies, series, onWatch, onDetails, initialGenre = 'Sci-Fi' }) {
  const [activeGenre, setActiveGenre] = useState(initialGenre === 'All' ? 'Sci-Fi' : initialGenre);

  const filteredMovies = movies.filter(m => m.genre === activeGenre);
  const filteredSeries = series.filter(s => s.genre === activeGenre);

  return (
    <div className="container" style={{ padding: '30px 20px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <span className="section-eyebrow">Thematic Collections</span>
        <h1 className="font-display" style={{ fontSize: '2.8rem', marginTop: '6px' }}>
          Browse by Genre
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px' }}>
          Select a cinematic genre to explore curated independent films and web series.
        </p>
      </div>

      {/* Genre Pills Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
        {GENRES.filter(g => g !== 'All').map(genre => (
          <button
            key={genre}
            type="button"
            className={`season-tab-btn ${activeGenre === genre ? 'active' : ''}`}
            onClick={() => setActiveGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movies in this genre */}
      <section style={{ marginBottom: '60px' }}>
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">
              {activeGenre} Movies ({filteredMovies.length})
            </h2>
          </div>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="content-grid">
            {filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onWatch={onWatch}
                onDetails={onDetails}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No movies currently cataloged in {activeGenre}.</p>
        )}
      </section>

      {/* Series in this genre */}
      <section>
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">
              {activeGenre} Web Series ({filteredSeries.length})
            </h2>
          </div>
        </div>

        {filteredSeries.length > 0 ? (
          <div className="content-grid">
            {filteredSeries.map(s => (
              <SeriesCard
                key={s.id}
                series={s}
                onDetails={onDetails}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No web series currently cataloged in {activeGenre}.</p>
        )}
      </section>
    </div>
  );
}
