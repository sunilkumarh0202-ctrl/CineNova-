import React, { useState, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import { GENRES } from '../data/sampleData';
import { FilmIcon } from '../components/Icons';

export default function Movies({ movies, onWatch, onDetails, initialGenre = 'All' }) {
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMinRating, setSelectedMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'rating'

  // Extract unique available years from movies
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(movies.map(m => m.year).filter(Boolean)));
    return years.sort((a, b) => b - a);
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      // Genre filter
      if (selectedGenre !== 'All' && movie.genre !== selectedGenre) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'All' && String(movie.year) !== String(selectedYear)) {
        return false;
      }
      // Rating filter
      if (parseFloat(selectedMinRating) > 0 && (movie.rating || 0) < parseFloat(selectedMinRating)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      // default: latest by year
      return (b.year || 0) - (a.year || 0);
    });
  }, [movies, selectedGenre, selectedYear, selectedMinRating, sortBy]);

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedYear('All');
    setSelectedMinRating('0');
    setSortBy('latest');
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', paddingTop: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="section-eyebrow">Authorized Feature Films</span>
        <h1 className="font-display" style={{ fontSize: '2.8rem', marginTop: '6px' }}>
          Explore Movies
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px' }}>
          Discover creator-licensed, high-definition movies across every cinematic genre.
        </p>
      </div>

      {/* Filter and Sorting Control Bar */}
      <div className="filter-bar" role="search" aria-label="Movie Filters">
        <div className="filter-group">
          {/* Genre Filter */}
          <label htmlFor="movie-genre-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Genre:
          </label>
          <select
            id="movie-genre-filter"
            className="select-input"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Year Filter */}
          <label htmlFor="movie-year-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
            Year:
          </label>
          <select
            id="movie-year-filter"
            className="select-input"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All Years</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Minimum Rating */}
          <label htmlFor="movie-rating-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
            Min Rating:
          </label>
          <select
            id="movie-rating-filter"
            className="select-input"
            value={selectedMinRating}
            onChange={(e) => setSelectedMinRating(e.target.value)}
          >
            <option value="0">Any Rating</option>
            <option value="8.0">★ 8.0 & Above</option>
            <option value="8.5">★ 8.5 & Above</option>
            <option value="9.0">★ 9.0 & Above</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="filter-group">
          <label htmlFor="movie-sort" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Sort By:
          </label>
          <select
            id="movie-sort"
            className="select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Release Year (Latest)</option>
            <option value="rating">Rating (Highest)</option>
          </select>

          {(selectedGenre !== 'All' || selectedYear !== 'All' || selectedMinRating !== '0') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid Results or Empty State */}
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
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
          <FilmIcon size={44} style={{ color: 'var(--accent-gold)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No movies found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            No movies match the selected filters. Try broadening your filter criteria.
          </p>
          <button type="button" className="btn btn-primary btn-sm" onClick={resetFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
