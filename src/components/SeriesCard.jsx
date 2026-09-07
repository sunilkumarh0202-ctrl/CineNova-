import React from 'react';
import { StarIcon, InfoIcon, TvIcon } from './Icons';

export default function SeriesCard({ series, onDetails }) {
  if (!series) return null;

  return (
    <article
      className="media-card"
      onClick={() => onDetails(series.id, 'series')}
      style={{ cursor: 'pointer' }}
      aria-label={`${series.title} Series`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDetails(series.id, 'series');
        }
      }}
    >
      <div className="media-poster-wrap">
        <img
          src={series.poster}
          alt={`${series.title} series poster`}
          className="media-poster-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&auto=format&fit=crop&q=80';
          }}
        />

        <div className="card-rating">
          <StarIcon size={12} />
          <span>{series.rating}</span>
        </div>

        {series.featured && <div className="card-badge">Featured Series</div>}
        {!series.featured && series.trending && (
          <div className="card-badge" style={{ borderColor: '#F5A623', color: '#F5A623' }}>Trending</div>
        )}

        <div className="media-overlay">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDetails(series.id, 'series');
            }}
          >
            <InfoIcon size={16} /> Explore Series
          </button>
        </div>
      </div>

      <div className="media-info">
        <div>
          <h3 className="media-title" title={series.title}>
            {series.title}
          </h3>
          <div className="media-meta">
            <span>{series.year}</span>
            <span>•</span>
            <span>{series.genre}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TvIcon size={14} />
            {series.seasonsCount || 1} {series.seasonsCount === 1 ? 'Season' : 'Seasons'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            {series.episodesCount || 0} Episodes
          </span>
        </div>
      </div>
    </article>
  );
}
