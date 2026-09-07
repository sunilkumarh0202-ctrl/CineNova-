import React from 'react';
import { PlayIcon, InfoIcon, StarIcon } from './Icons';

export default function Hero({ movie, onWatch, onDetails }) {
  if (!movie) return null;

  return (
    <section className="hero-section" aria-label="Featured Story">
      {/* Background Cinematic Artwork & Gradients */}
      <div className="hero-backdrop-wrapper">
        <img
          src={movie.backdrop || movie.poster}
          alt=""
          className="hero-backdrop-img"
          loading="eager"
        />
        <div className="hero-gradient-overlay" />
      </div>

      <div className="container hero-content-grid">
        {/* Hero Narrative Information */}
        <div className="hero-text-content">
          <div className="hero-badge">
            <span aria-hidden="true">★</span> Featured Premiere
          </div>

          <h1 className="hero-title">{movie.title}</h1>

          <div className="hero-meta-row">
            <span className="rating-pill">
              <StarIcon size={14} />
              {movie.rating}
            </span>
            <span className="meta-dot" aria-hidden="true"></span>
            <span>{movie.year}</span>
            <span className="meta-dot" aria-hidden="true"></span>
            <span>{movie.genre}</span>
            <span className="meta-dot" aria-hidden="true"></span>
            <span>{movie.duration || 'Feature Film'}</span>
          </div>

          <p className="hero-description">
            {movie.description}
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onWatch(movie)}
              aria-label={`Watch ${movie.title} now`}
            >
              <PlayIcon size={20} /> Watch Now
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onDetails(movie.id, 'movie')}
              aria-label={`View more details about ${movie.title}`}
            >
              <InfoIcon size={20} /> More Details
            </button>
          </div>
        </div>

        {/* Featured Poster Card */}
        <div className="hero-poster-card" onClick={() => onDetails(movie.id, 'movie')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onDetails(movie.id, 'movie')} aria-label={`View ${movie.title} poster`}>
          <img
            src={movie.poster}
            alt={`${movie.title} official poster`}
            loading="eager"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      </div>
    </section>
  );
}
