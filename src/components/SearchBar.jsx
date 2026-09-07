import React from 'react';
import { SearchIcon, CloseIcon } from './Icons';

export default function SearchBar({ searchQuery, onSearchChange, onClear }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '680px', margin: '0 auto 36px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <SearchIcon size={20} className="search-icon-decor" style={{ color: 'var(--accent-gold)', marginRight: '12px' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search authorized titles, genres, actors, directors, or year..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.05rem',
            fontFamily: 'inherit',
            outline: 'none',
            minHeight: '40px',
          }}
          aria-label="Search Catalog"
          autoFocus
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              cursor: 'pointer',
            }}
            aria-label="Clear Search Input"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
