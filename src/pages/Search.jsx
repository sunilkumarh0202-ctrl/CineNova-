import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import { SearchIcon, FilmIcon, TvIcon } from '../components/Icons';

export default function Search({ movies, series, onWatch, onDetails }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'movies' | 'series'

  // Live filtered search results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { movies: [], series: [] };

    const matchedMovies = movies.filter(m => {
      const matchTitle = m.title?.toLowerCase().includes(q);
      const matchGenre = m.genre?.toLowerCase().includes(q);
      const matchYear = String(m.year)?.includes(q);
      const matchDirector = m.director?.toLowerCase().includes(q);
      const matchCast = Array.isArray(m.cast)
        ? m.cast.some(c => c.toLowerCase().includes(q))
        : m.cast?.toLowerCase().includes(q);

      return matchTitle || matchGenre || matchYear || matchDirector || matchCast;
    });

    const matchedSeries = series.filter(s => {
      const matchTitle = s.title?.toLowerCase().includes(q);
      const matchGenre = s.genre?.toLowerCase().includes(q);
      const matchYear = String(s.year)?.includes(q);
      const matchDirector = s.director?.toLowerCase().includes(q);
      const matchCast = Array.isArray(s.cast)
        ? s.cast.some(c => c.toLowerCase().includes(q))
        : s.cast?.toLowerCase().includes(q);

      return matchTitle || matchGenre || matchYear || matchDirector || matchCast;
    });

    return {
      movies: matchedMovies,
      series: matchedSeries,
    };
  }, [movies, series, query]);

  const totalResults = searchResults.movies.length + searchResults.series.length;

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="section-eyebrow">Instant Catalog Lookup</span>
        <h1 className="font-display" style={{ fontSize: '2.6rem', marginTop: '6px' }}>
          Search CineNova
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
          Search movies and web series by title, genre, release year, director, or cast.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchQuery={query}
        onSearchChange={setQuery}
        onClear={() => setQuery('')}
      />

      {/* Filter Tabs if user typed */}
      {query && totalResults > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <button
            type="button"
            className={`season-tab-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            All Results ({totalResults})
          </button>
          <button
            type="button"
            className={`season-tab-btn ${typeFilter === 'movies' ? 'active' : ''}`}
            onClick={() => setTypeFilter('movies')}
          >
            Movies ({searchResults.movies.length})
          </button>
          <button
            type="button"
            className={`season-tab-btn ${typeFilter === 'series' ? 'active' : ''}`}
            onClick={() => setTypeFilter('series')}
          >
            Web Series ({searchResults.series.length})
          </button>
        </div>
      )}

      {/* Query Results */}
      {query ? (
        totalResults > 0 ? (
          <div>
            {/* Matching Movies */}
            {(typeFilter === 'all' || typeFilter === 'movies') && searchResults.movies.length > 0 && (
              <section style={{ marginBottom: '50px' }}>
                <div className="section-header">
                  <div className="section-title-wrap">
                    <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FilmIcon size={20} /> Movies ({searchResults.movies.length})
                    </h2>
                  </div>
                </div>
                <div className="content-grid">
                  {searchResults.movies.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onWatch={onWatch}
                      onDetails={onDetails}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Matching Series */}
            {(typeFilter === 'all' || typeFilter === 'series') && searchResults.series.length > 0 && (
              <section>
                <div className="section-header">
                  <div className="section-title-wrap">
                    <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TvIcon size={20} /> Web Series ({searchResults.series.length})
                    </h2>
                  </div>
                </div>
                <div className="content-grid">
                  {searchResults.series.map(s => (
                    <SeriesCard
                      key={s.id}
                      series={s}
                      onDetails={onDetails}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* Empty State */
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
            <SearchIcon size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No results found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 20px' }}>
              We couldn&apos;t find any titles matching &ldquo;{query}&rdquo;. Check spelling or try a genre or year.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setQuery('')}
            >
              Clear Search
            </button>
          </div>
        )
      ) : (
        /* Prompt to type search */
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <p>Start typing above to search our catalog instantly.</p>
        </div>
      )}
    </div>
  );
}
