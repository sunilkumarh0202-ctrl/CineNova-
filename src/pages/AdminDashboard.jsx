import React, { useState, useMemo } from 'react';
import { FilmIcon, TvIcon, StarIcon, PlusIcon, EditIcon, TrashIcon, LogOutIcon, ShieldIcon } from '../components/Icons';
import { getCatalogStats, deleteMovie, deleteSeries, getSettings, updateSettings, resetToSampleData } from '../services/database';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminDashboard({
  movies,
  series,
  onAddMovie,
  onAddSeries,
  onEditMovie,
  onEditSeries,
  onManageEpisodes,
  onLogout,
  onRefreshData
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'movies' | 'series' | 'settings'

  // Delete state
  const [deleteCandidate, setDeleteCandidate] = useState(null); // { id, type: 'movie' | 'series', title }

  // Settings state
  const [settings, setSettings] = useState(getSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Dynamic statistics
  const stats = useMemo(() => {
    return getCatalogStats();
  }, [movies, series]);

  const handleDeleteConfirmed = () => {
    if (!deleteCandidate) return;

    if (deleteCandidate.type === 'movie') {
      deleteMovie(deleteCandidate.id);
    } else if (deleteCandidate.type === 'series') {
      deleteSeries(deleteCandidate.id);
    }

    setDeleteCandidate(null);
    onRefreshData();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleResetSampleData = () => {
    if (window.confirm("Reset all movies, web series, and episodes to initial default sample catalog?")) {
      resetToSampleData();
      onRefreshData();
    }
  };

  return (
    <div className="container admin-layout">
      {/* Header bar */}
      <div className="admin-header">
        <div>
          <span className="section-eyebrow">Administration & Content Operations</span>
          <h1 className="font-display" style={{ fontSize: '2.5rem', marginTop: '4px' }}>
            CineNova Studio Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authorized catalog publishing, video streaming configuration, and series management.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onLogout}
            title="Sign out of admin session"
          >
            <LogOutIcon size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Dynamic Statistics Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <FilmIcon size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.totalMovies}</div>
            <div className="stat-label">Total Movies</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <TvIcon size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.totalSeries}</div>
            <div className="stat-label">Total Web Series</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <span style={{ fontSize: '1.4rem' }}>🎬</span>
          </div>
          <div>
            <div className="stat-val">{stats.totalEpisodes}</div>
            <div className="stat-label">Total Episodes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <StarIcon size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.featuredTitles}</div>
            <div className="stat-label">Featured Titles</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dashboard'}
          className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Overview & Quick Actions
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'movies'}
          className={`admin-tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          Manage Movies ({movies.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'series'}
          className={`admin-tab-btn ${activeTab === 'series' ? 'active' : ''}`}
          onClick={() => setActiveTab('series')}
        >
          Manage Web Series ({series.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'settings'}
          className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Platform Settings
        </button>
      </div>

      {/* TAB 1: OVERVIEW / QUICK ACTIONS */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Publish Feature Film</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Add a new authorized standalone movie, specify video streaming URL, metadata, poster, and cast.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onAddMovie}
              >
                <PlusIcon size={18} /> Add New Movie
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Publish Web Series</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Create a serialized show, then organize multiple seasons, episodes, and streaming media links.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onAddSeries}
              >
                <PlusIcon size={18} /> Add Web Series
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(232, 197, 104, 0.06)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldIcon size={18} /> CineNova Ownership Policy
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              CineNova is engineered specifically for authorized media distributors, independent studios, and creator collectives. Content published here immediately synchronizes with client storage. When ready for cloud scale, easily swap `src/services/database.js` to Firestore or Supabase.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MOVIES LIST */}
      {activeTab === 'movies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="font-display" style={{ fontSize: '1.6rem' }}>All Authorized Movies</h2>
            <button type="button" className="btn btn-primary btn-sm" onClick={onAddMovie}>
              <PlusIcon size={16} /> Add Movie
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Featured</th>
                  <th>Trending</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={movie.poster}
                          alt=""
                          style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <strong>{movie.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {movie.duration || 'Feature'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{movie.genre}</td>
                    <td>{movie.year}</td>
                    <td>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                        ★ {movie.rating}
                      </span>
                    </td>
                    <td>{movie.featured ? 'Yes' : 'No'}</td>
                    <td>{movie.trending ? 'Yes' : 'No'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => onEditMovie(movie)}
                          title="Edit movie"
                          style={{ width: '34px', height: '34px' }}
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setDeleteCandidate({ id: movie.id, type: 'movie', title: movie.title })}
                          title="Delete movie"
                          style={{ width: '34px', height: '34px', color: '#ff6666' }}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERIES LIST */}
      {activeTab === 'series' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="font-display" style={{ fontSize: '1.6rem' }}>All Authorized Web Series</h2>
            <button type="button" className="btn btn-primary btn-sm" onClick={onAddSeries}>
              <PlusIcon size={16} /> Add Series
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Series Title</th>
                  <th>Genre</th>
                  <th>Seasons</th>
                  <th>Episodes</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {series.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={s.poster}
                          alt=""
                          style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <strong>{s.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {s.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{s.genre}</td>
                    <td>{s.seasonsCount || 1}</td>
                    <td>{s.episodesCount || 0}</td>
                    <td>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                        ★ {s.rating}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onManageEpisodes(s)}
                          style={{ fontSize: '0.8rem', padding: '4px 10px', minHeight: '34px' }}
                          title="Manage episodes and seasons"
                        >
                          Manage Episodes
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => onEditSeries(s)}
                          title="Edit series"
                          style={{ width: '34px', height: '34px' }}
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setDeleteCandidate({ id: s.id, type: 'series', title: s.title })}
                          title="Delete series"
                          style={{ width: '34px', height: '34px', color: '#ff6666' }}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="form-card" style={{ maxWidth: '700px', margin: '0' }}>
          <h2 className="font-display" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            Platform Settings
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.92rem' }}>
            Configure branding metadata, streaming defaults, and catalog state.
          </p>

          {settingsSaved && (
            <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', color: '#4ade80', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
              Platform settings updated successfully.
            </div>
          )}

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-field">
              <label className="form-label">Platform Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.platformName || 'CineNova'}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                className="form-input"
                value={settings.tagline || 'Your stories. Your screen.'}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Licensing & Rights Contact Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.contactEmail || 'licensing@cinenova.stream'}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Default Playback Stream Resolution</label>
              <select
                className="form-select"
                value={settings.defaultPlaybackQuality || '1080p'}
                onChange={(e) => setSettings({ ...settings, defaultPlaybackQuality: e.target.value })}
              >
                <option value="4K">4K UHD</option>
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD</option>
                <option value="Auto">Auto Adaptive Bitrate</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetSampleData}
                style={{ color: '#ff9999' }}
              >
                Reset Catalog to Sample Data
              </button>

              <button type="submit" className="btn btn-primary">
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title={`Delete ${deleteCandidate?.type === 'movie' ? 'Movie' : 'Web Series'}`}
        message="Are you sure you want to delete this content?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
