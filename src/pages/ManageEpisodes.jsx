import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon, PlayIcon } from '../components/Icons';
import { getEpisodes, saveEpisode, updateEpisode, deleteEpisode } from '../services/database';
import ConfirmModal from '../components/ConfirmModal';

export default function ManageEpisodes({ series, onBack, onWatchEpisode }) {
  const [episodes, setEpisodes] = useState([]);
  const [activeSeasonFilter, setActiveSeasonFilter] = useState('All');
  
  // Modal / Form state for Add/Edit Episode
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  const [formSeason, setFormSeason] = useState(1);
  const [formEpNumber, setFormEpNumber] = useState(1);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDuration, setFormDuration] = useState('45m');
  const [formVideoUrl, setFormVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);

  const loadEpisodes = () => {
    if (!series) return;
    const eps = getEpisodes(series.id);
    setEpisodes(eps);
  };

  useEffect(() => {
    loadEpisodes();
  }, [series]);

  const handleOpenAdd = () => {
    setEditingEpisode(null);
    const seasonEps = episodes.filter(e => Number(e.season) === Number(activeSeasonFilter === 'All' ? 1 : activeSeasonFilter));
    const nextNum = seasonEps.length > 0 ? Math.max(...seasonEps.map(e => e.episodeNumber)) + 1 : 1;
    
    setFormSeason(activeSeasonFilter === 'All' ? 1 : Number(activeSeasonFilter));
    setFormEpNumber(nextNum);
    setFormTitle('');
    setFormDesc('');
    setFormDuration('48m');
    setFormVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (ep) => {
    setEditingEpisode(ep);
    setFormSeason(ep.season);
    setFormEpNumber(ep.episodeNumber);
    setFormTitle(ep.title);
    setFormDesc(ep.description);
    setFormDuration(ep.duration);
    setFormVideoUrl(ep.videoUrl);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveEpisode = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Episode title is required.');
      return;
    }

    const payload = {
      seriesId: series.id,
      season: Number(formSeason) || 1,
      episodeNumber: Number(formEpNumber) || 1,
      title: formTitle.trim(),
      description: formDesc.trim(),
      duration: formDuration.trim() || '45m',
      videoUrl: formVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    };

    if (editingEpisode) {
      updateEpisode(editingEpisode.id, payload);
    } else {
      saveEpisode(payload);
    }

    setIsFormOpen(false);
    loadEpisodes();
  };

  const handleDeleteConfirmed = () => {
    if (deleteCandidateId) {
      deleteEpisode(deleteCandidateId);
      setDeleteCandidateId(null);
      loadEpisodes();
    }
  };

  // Filter episodes by season
  const filteredEpisodes = episodes.filter(ep => {
    if (activeSeasonFilter === 'All') return true;
    return String(ep.season) === String(activeSeasonFilter);
  });

  const seasonsList = Array.from({ length: series?.seasonsCount || 1 }, (_, i) => i + 1);

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Header */}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onBack}
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeftIcon size={18} /> Return to Admin Series Catalog
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <span className="section-eyebrow">Episode Management</span>
          <h1 className="font-display" style={{ fontSize: '2.4rem', marginTop: '4px' }}>
            {series?.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage seasons and authorized streaming video URLs for individual episodes.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAdd}
        >
          <PlusIcon size={18} /> Add New Episode
        </button>
      </div>

      {/* Season Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '6px' }}>
        <button
          type="button"
          className={`season-tab-btn ${activeSeasonFilter === 'All' ? 'active' : ''}`}
          onClick={() => setActiveSeasonFilter('All')}
        >
          All Seasons ({episodes.length})
        </button>
        {seasonsList.map(sNum => {
          const count = episodes.filter(e => e.season === sNum).length;
          return (
            <button
              key={sNum}
              type="button"
              className={`season-tab-btn ${activeSeasonFilter === String(sNum) ? 'active' : ''}`}
              onClick={() => setActiveSeasonFilter(String(sNum))}
            >
              Season {sNum} ({count})
            </button>
          );
        })}
      </div>

      {/* Episode Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title font-display">
              {editingEpisode ? `Edit Episode: S${editingEpisode.season} E${editingEpisode.episodeNumber}` : 'Add New Episode'}
            </h3>

            {formError && (
              <div style={{ color: '#ff7777', fontSize: '0.88rem', marginBottom: '14px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEpisode} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="ep-season">Season #</label>
                  <input
                    id="ep-season"
                    type="number"
                    min="1"
                    className="form-input"
                    value={formSeason}
                    onChange={(e) => setFormSeason(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="ep-num">Episode #</label>
                  <input
                    id="ep-num"
                    type="number"
                    min="1"
                    className="form-input"
                    value={formEpNumber}
                    onChange={(e) => setFormEpNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="ep-title">Episode Title *</label>
                <input
                  id="ep-title"
                  type="text"
                  className="form-input"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. The Winter Solstice Herald"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="ep-desc">Episode Description</label>
                <textarea
                  id="ep-desc"
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Plot summary for this specific episode..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="ep-duration">Duration</label>
                  <input
                    id="ep-duration"
                    type="text"
                    className="form-input"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 52m"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="ep-videourl">Authorized Video URL *</label>
                  <input
                    id="ep-videourl"
                    type="url"
                    className="form-input"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://cdn.example.com/stream.mp4"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingEpisode ? 'Save Changes' : 'Add Episode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Episode Table */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Season & Ep</th>
              <th>Title</th>
              <th>Duration</th>
              <th>Video Stream</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEpisodes.length > 0 ? (
              filteredEpisodes.map(ep => (
                <tr key={ep.id}>
                  <td>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                      S{ep.season} E{ep.episodeNumber}
                    </span>
                  </td>
                  <td>
                    <strong>{ep.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ep.description}
                    </div>
                  </td>
                  <td>{ep.duration}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ep.videoUrl ? 'Stream Configured' : 'Missing Video'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => onWatchEpisode(series, ep)}
                        title="Preview Stream"
                        style={{ width: '34px', height: '34px' }}
                      >
                        <PlayIcon size={14} />
                      </button>

                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => handleOpenEdit(ep)}
                        title="Edit Episode"
                        style={{ width: '34px', height: '34px' }}
                      >
                        <EditIcon size={14} />
                      </button>

                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => setDeleteCandidateId(ep.id)}
                        title="Delete Episode"
                        style={{ width: '34px', height: '34px', color: '#ff6666' }}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No episodes found. Click &quot;Add New Episode&quot; above to add episodes to this web series.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidateId)}
        title="Delete Episode"
        message="Are you sure you want to delete this content?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteCandidateId(null)}
      />
    </div>
  );
}
