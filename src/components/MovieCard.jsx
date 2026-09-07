import React from 'react';
import { PlayIcon, InfoIcon, StarIcon } from './Icons';

export default function MovieCard({ movie, onWatch, onDetails }) {
  if (!movie) return null;

  return (
    <article className="media-card" aria-label={movie.title}>
      {/* Poster container with badges & overlay */}
      <div className="media-poster-wrap">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="media-poster-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Rating Pill */}
        <div className="card-rating">
          <StarIcon size={12} />
          <span>{movie.rating}</span>
        </div>

        {/* Optional Featured / Trending Pill */}
        {movie.featured && <div className="card-badge">Featured</div>}
        {!movie.featured && movie.trending && <div className="card-badge" style={{ borderColor: '#F5A623', color: '#F5A623' }}>Trending</div>}

        {/* Hover Quick Action Overlay */}
        <div className="media-overlay">
          <button
            type="button"
            className="icon-btn"
            style={{ width: '52px', height: '52px', backgroundColor: 'var(--accent-gold)', color: '#090A0D' }}
            onClick={() => onWatch(movie)}
            title={`Watch ${movie.title}`}
            aria-label={`Watch ${movie.title}`}
          >
            <PlayIcon size={22} />
          </button>
        </div>
      </div>

      {/* Card Information */}
      <div className="media-info">
        <div>
          <h3 className="media-title" title={movie.title}>
            {movie.title}
          </h3>
          <div className="media-meta">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.genre}</span>
            {movie.duration && (
              <>
                <span>•</span>
                <span>{movie.duration}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons: Watch and Details */}
        <div className="media-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onWatch(movie)}
            aria-label={`Watch ${movie.title}`}
          >
            <PlayIcon size={14} /> Watch
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onDetails(movie.id, 'movie')}
            aria-label={`Details for ${movie.title}`}
          >
            <InfoIcon size={14} /> Details
          </button>
        </div>
      </div>
    </article>
  );
}
