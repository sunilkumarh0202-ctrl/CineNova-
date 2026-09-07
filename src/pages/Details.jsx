import React, { useState, useMemo } from 'react';
import { PlayIcon, StarIcon, ArrowLeftIcon, TvIcon, ShieldIcon } from '../components/Icons';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import { getEpisodes } from '../services/database';

export default function Details({ itemId, itemType, movies, series, onWatch, onDetails, onBack }) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Find item
  const isMovie = itemType === 'movie';
  const item = isMovie 
    ? movies.find(m => String(m.id) === String(itemId))
    : series.find(s => String(s.id) === String(itemId));

  // Episodes for series
  const episodes = useMemo(() => {
    if (isMovie || !item) return [];
    return getEpisodes(item.id, selectedSeason);
  }, [isMovie, item, selectedSeason]);

  // Available seasons for series
  const seasonsList = useMemo(() => {
    if (isMovie || !item) return [];
    const count = item.seasonsCount || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [isMovie, item]);

  // Related titles in same genre
  const relatedTitles = useMemo(() => {
    if (!item) return [];
    if (isMovie) {
      return movies.filter(m => String(m.id) !== String(item.id) && m.genre === item.genre).slice(0, 4);
    } else {
      return series.filter(s => String(s.id) !== String(item.id) && s.genre === item.genre).slice(0, 4);
    }
  }, [item, isMovie, movies, series]);

  if (!item) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Title Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px' }}>
          The requested movie or web series does not exist or has been removed.
        </p>
        <button type="button" className="btn btn-primary" onClick={onBack}>
          <ArrowLeftIcon size={18} /> Return to Catalog
        </button>
      </div>
    );
  }

  const castString = Array.isArray(item.cast) ? item.cast.join(', ') : item.cast;

  return (
    <div className="details-page">
      {/* Hero Backdrop Section */}
      <section className="hero-section details-hero" aria-label="Media Details Header">
        <div className="hero-backdrop-wrapper">
          <img
            src={item.backdrop || item.poster}
            alt=""
            className="hero-backdrop-img"
          />
          <div className="hero-gradient-overlay" />
        </div>

        <div className="container">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBack}
            style={{ marginBottom: '24px', zIndex: 10, position: 'relative' }}
            aria-label="Back to browse"
          >
            <ArrowLeftIcon size={18} /> Back
          </button>

          <div className="details-grid">
            {/* Poster Card */}
            <div className="details-poster-wrap">
              <img
                src={item.poster}
                alt={`${item.title} poster`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {/* Title Information */}
            <div className="details-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span className="card-badge" style={{ position: 'static' }}>
                  {isMovie ? 'Movie' : 'Web Series'}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldIcon size={13} /> Licensed & Authorized
                </span>
              </div>

              <h1 className="details-title font-display">{item.title}</h1>

              {/* Specs row */}
              <div className="details-specs">
                <span className="rating-pill">
                  <StarIcon size={14} /> {item.rating}
                </span>
                <span className="meta-dot"></span>
                <span>{item.year}</span>
                <span className="meta-dot"></span>
                <span>{item.genre}</span>
                {isMovie && item.duration && (
                  <>
                    <span className="meta-dot"></span>
                    <span>{item.duration}</span>
                  </>
                )}
                {!isMovie && (
                  <>
                    <span className="meta-dot"></span>
                    <span>{item.seasonsCount || 1} Season{(item.seasonsCount || 1) > 1 ? 's' : ''}</span>
                    <span className="meta-dot"></span>
                    <span>{item.episodesCount || 0} Episodes</span>
                  </>
                )}
                {item.language && (
                  <>
                    <span className="meta-dot"></span>
                    <span>{item.language}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="details-desc">{item.description}</p>

              {/* Production Credits Block */}
              <div className="details-credits">
                {item.director && (
                  <div className="credit-item">
                    <span className="credit-label">Director</span>
                    <span className="credit-val">{item.director}</span>
                  </div>
                )}
                {castString && (
                  <div className="credit-item">
                    <span className="credit-label">Starring</span>
                    <span className="credit-val">{castString}</span>
                  </div>
                )}
                <div className="credit-item">
                  <span className="credit-label">Audio / Language</span>
                  <span className="credit-val">{item.language || 'English (Original)'}</span>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {isMovie ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onWatch(item)}
                    aria-label={`Watch ${item.title}`}
                  >
                    <PlayIcon size={20} /> Watch Now
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      // Watch first available episode
                      const firstEp = episodes[0];
                      if (firstEp) onWatch(item, firstEp);
                      else onWatch(item);
                    }}
                    aria-label={`Stream ${item.title} Episode 1`}
                  >
                    <PlayIcon size={20} /> Start Watching S1 E1
                  </button>
                )}

                {item.trailerUrl && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowTrailerModal(true)}
                  >
                    Official Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* For Web Series: Season Selector & Episode List */}
        {!isMovie && (
          <section className="episodes-section" aria-labelledby="episodes-heading">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-eyebrow">Episodes Catalog</span>
                <h2 id="episodes-heading" className="section-title">
                  Season {selectedSeason} Episodes
                </h2>
              </div>
            </div>

            {/* Season Selector Tabs */}
            {seasonsList.length > 1 && (
              <div className="season-tabs" role="tablist" aria-label="Season Selection">
                {seasonsList.map(seasonNum => (
                  <button
                    key={seasonNum}
                    type="button"
                    role="tab"
                    aria-selected={selectedSeason === seasonNum}
                    className={`season-tab-btn ${selectedSeason === seasonNum ? 'active' : ''}`}
                    onClick={() => setSelectedSeason(seasonNum)}
                  >
                    Season {seasonNum}
                  </button>
                ))}
              </div>
            )}

            {/* Episode List */}
            {episodes.length > 0 ? (
              <div className="episodes-list">
                {episodes.map(ep => (
                  <div key={ep.id} className="episode-card">
                    <div className="episode-left">
                      <div className="episode-num-badge">
                        {ep.episodeNumber < 10 ? `0${ep.episodeNumber}` : ep.episodeNumber}
                      </div>
                      <div className="episode-details">
                        <h4>{ep.title}</h4>
                        <p>{ep.description}</p>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '4px', display: 'inline-block' }}>
                          Duration: {ep.duration}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onWatch(item, ep)}
                      aria-label={`Watch Season ${ep.season} Episode ${ep.episodeNumber}: ${ep.title}`}
                    >
                      <PlayIcon size={14} /> Watch Episode
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-muted)' }}>
                  No episodes currently listed for Season {selectedSeason}. Check back soon or add episodes via Admin.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Related Titles */}
        {relatedTitles.length > 0 && (
          <section style={{ marginTop: '70px' }} aria-labelledby="related-heading">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-eyebrow">More Like This</span>
                <h2 id="related-heading" className="section-title">Related Titles</h2>
              </div>
            </div>

            <div className="content-grid">
              {relatedTitles.map(rel => (
                isMovie ? (
                  <MovieCard
                    key={rel.id}
                    movie={rel}
                    onWatch={onWatch}
                    onDetails={onDetails}
                  />
                ) : (
                  <SeriesCard
                    key={rel.id}
                    series={rel}
                    onDetails={onDetails}
                  />
                )
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="modal-overlay" onClick={() => setShowTrailerModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '800px', padding: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{item.title} — Official Trailer</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowTrailerModal(false)}
              >
                Close
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <video
                src={item.trailerUrl || item.videoUrl}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
