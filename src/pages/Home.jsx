import React from 'react';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import { ArrowRightIcon, FilmIcon, TvIcon } from '../components/Icons';
import { GENRES } from '../data/sampleData';

export default function Home({ movies, series, onWatch, onDetails, navigate, onGenreSelect }) {
  // Find featured movie for hero, fallback to first movie
  const heroMovie = movies.find(m => m.title === "The Last Light") || movies.find(m => m.featured) || movies[0];

  // Trending Movies
  const trendingMovies = movies.filter(m => m.trending).slice(0, 4);

  // Latest Movies
  const latestMovies = [...movies].sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 4);

  // Popular Web Series
  const popularSeries = series.filter(s => s.trending || s.featured).slice(0, 4);

  // Recently Added (both movies and series)
  const recentlyAddedMovies = movies.filter(m => m.recentlyAdded || m.year >= 2026).slice(0, 4);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <Hero
        movie={heroMovie}
        onWatch={onWatch}
        onDetails={onDetails}
      />

      {/* Main Content Container */}
      <div className="container" style={{ paddingBottom: '60px' }}>

        {/* 2. Trending Movies */}
        <section style={{ marginTop: '50px' }} aria-labelledby="trending-heading">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Audience Favorites</span>
              <h2 id="trending-heading" className="section-title">Trending Movies</h2>
            </div>
            <a
              href="#movies"
              className="section-link"
              onClick={(e) => { e.preventDefault(); navigate('movies'); }}
            >
              View All <ArrowRightIcon size={16} />
            </a>
          </div>

          <div className="content-grid">
            {trendingMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onWatch={onWatch}
                onDetails={onDetails}
              />
            ))}
          </div>
        </section>

        {/* 3. Latest Movies */}
        <section style={{ marginTop: '70px' }} aria-labelledby="latest-movies-heading">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Fresh Premieres</span>
              <h2 id="latest-movies-heading" className="section-title">Latest Movies</h2>
            </div>
            <a
              href="#movies"
              className="section-link"
              onClick={(e) => { e.preventDefault(); navigate('movies'); }}
            >
              Browse Movies <ArrowRightIcon size={16} />
            </a>
          </div>

          <div className="content-grid">
            {latestMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onWatch={onWatch}
                onDetails={onDetails}
              />
            ))}
          </div>
        </section>

        {/* 4. Popular Web Series */}
        <section style={{ marginTop: '70px' }} aria-labelledby="popular-series-heading">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Serialized Epics</span>
              <h2 id="popular-series-heading" className="section-title">Popular Web Series</h2>
            </div>
            <a
              href="#series"
              className="section-link"
              onClick={(e) => { e.preventDefault(); navigate('series'); }}
            >
              Explore Series <ArrowRightIcon size={16} />
            </a>
          </div>

          <div className="content-grid">
            {popularSeries.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                onDetails={onDetails}
              />
            ))}
          </div>
        </section>

        {/* 5. Recently Added */}
        <section style={{ marginTop: '70px' }} aria-labelledby="recently-added-heading">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Catalog Additions</span>
              <h2 id="recently-added-heading" className="section-title">Recently Added</h2>
            </div>
          </div>

          <div className="content-grid">
            {recentlyAddedMovies.map((movie) => (
              <MovieCard
                key={`recent-${movie.id}`}
                movie={movie}
                onWatch={onWatch}
                onDetails={onDetails}
              />
            ))}
          </div>
        </section>

        {/* 6. Browse by Genre */}
        <section style={{ marginTop: '70px' }} aria-labelledby="genres-heading">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Discover Themes</span>
              <h2 id="genres-heading" className="section-title">Browse by Genre</h2>
            </div>
          </div>

          <div className="genre-grid">
            {GENRES.filter(g => g !== 'All').map((genre) => (
              <div
                key={genre}
                className="genre-card"
                onClick={() => onGenreSelect(genre)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onGenreSelect(genre)}
              >
                <div className="genre-card-title">{genre}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Call-To-Action */}
        <section className="cta-section" aria-label="Streaming Call to Action">
          <div className="cta-box">
            <h2 className="cta-title">Your stories. Your screen.</h2>
            <p className="cta-subtitle">
              CineNova brings you direct access to creator-licensed independent films and serialized storytelling with no pirated noise and zero compromise on cinematic quality.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('movies')}
              >
                <FilmIcon size={18} /> Start Streaming Movies
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('series')}
              >
                <TvIcon size={18} /> Explore Web Series
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
