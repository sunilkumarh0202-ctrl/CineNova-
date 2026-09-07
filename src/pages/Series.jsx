import React, { useState, useMemo } from 'react';
import SeriesCard from '../components/SeriesCard';
import { GENRES } from '../data/sampleData';
import { TvIcon } from '../components/Icons';

export default function Series({ series, onDetails, initialGenre = 'All' }) {
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMinRating, setSelectedMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('latest');

  // Extract unique available years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(series.map(s => s.year).filter(Boolean)));
    return years.sort((a, b) => b - a);
  }, [series]);

  // Filter and sort series
  const filteredSeries = useMemo(() => {
    return series.filter(item => {
      if (selectedGenre !== 'All' && item.genre !== selectedGenre) {
        return false;
      }
      if (selectedYear !== 'All' && String(item.year) !== String(selectedYear)) {
        return false;
      }
      if (parseFloat(selectedMinRating) > 0 && (item.rating || 0) < parseFloat(selectedMinRating)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (b.year || 0) - (a.year || 0);
    });
  }, [series, selectedGenre, selectedYear, selectedMinRating, sortBy]);

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedYear('All');
    setSelectedMinRating('0');
    setSortBy('latest');
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', paddingTop: '30px' }}>
      <div style={{ marginBottom: '32px' }}>
        <span className="section-eyebrow">Serialized Storytelling</span>
        <h1 className="font-display" style={{ fontSize: '2.8rem', marginTop: '6px' }}>
          Original Web Series
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px' }}>
          Immerse yourself in authorized, episodic dramas, sci-fi sagas, and mysteries.
        </p>
      </div>

      {/* Filter and Sorting Control Bar */}
      <div className="filter-bar" role="search" aria-label="Web Series Filters">
        <div className="filter-group">
          <label htmlFor="series-genre-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Genre:
          </label>
          <select
            id="series-genre-filter"
            className="select-input"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <label htmlFor="series-year-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
            Year:
          </label>
          <select
            id="series-year-filter"
            className="select-input"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All Years</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <label htmlFor="series-rating-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
            Min Rating:
          </label>
          <select
            id="series-rating-filter"
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

        <div className="filter-group">
          <label htmlFor="series-sort" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Sort By:
          </label>
          <select
            id="series-sort"
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
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
          <TvIcon size={44} style={{ color: 'var(--accent-gold)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No web series found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            No web series match the selected filter criteria.
          </p>
          <button type="button" className="btn btn-primary btn-sm" onClick={resetFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
