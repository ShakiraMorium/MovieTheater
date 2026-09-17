import React, { useEffect, useState } from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Users,
  ExternalLink,
  Film,
  Bookmark
} from 'lucide-react';
import { getShowWithCast } from '../services/tvmazeApi';

export default function MovieDetailsModal({
  movie,
  onClose,
  isFavorite = false,
  onToggleFavorite
}) {
  const [details, setDetails] = useState(movie);
  const [imgError, setImgError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Load cast data if not already present
  useEffect(() => {
    if (!movie?.id) return;
    let active = true;

    async function loadData() {
      if (movie.cast && movie.cast.length > 0) {
        setDetails(movie);
        return;
      }
      try {
        const fullData = await getShowWithCast(movie.id);
        if (active && fullData) {
          setDetails(fullData);
        }
      } catch (err) {
        console.log('Unable to load cast:', err);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [movie]);

  if (!movie) return null;

  const current = details || movie;
  const {
    id,
    name,
    year,
    premiered,
    rating,
    genres = [],
    summary,
    image,
    backdrop,
    status,
    runtime,
    language,
    network,
    officialSite,
    cast = []
  } = current;

  // Clean HTML tags from summary string
  const cleanSummary = summary
    ? summary.replace(/<[^>]*>?/gm, '')
    : 'No description available for this title.';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      id="movie-details-modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card" id="movie-details-modal-box">
        {/* Close Button */}
        <button
          id="modal-close-top-btn"
          className="modal-close-icon-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Hero Backdrop */}
        <div className="modal-backdrop-wrap">
          {backdrop && !backdropError ? (
            <img
              src={backdrop}
              alt={`${name} backdrop`}
              className="modal-backdrop-img"
              onError={() => setBackdropError(true)}
            />
          ) : (
            <div className="card-poster-fallback" style={{ height: '100%' }}>
              <Film size={48} />
            </div>
          )}
          <div className="modal-backdrop-gradient" />
        </div>

        {/* Scrollable details */}
        <div className="modal-scrollable-body">
          <div className="modal-content-grid">
            {/* Poster & Bookmark Button */}
            <div className="modal-poster-col">
              <div className="modal-poster-card">
                {image && !imgError ? (
                  <img
                    src={image}
                    alt={`${name} poster`}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="card-poster-fallback" style={{ height: '100%' }}>
                    <Film size={36} />
                    <span>No Poster</span>
                  </div>
                )}
              </div>

              <button
                id="modal-watchlist-toggle-btn"
                className={`modal-watchlist-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite(current)}
              >
                <Bookmark size={17} fill={isFavorite ? 'currentColor' : 'none'} />
                <span>{isFavorite ? 'Saved to Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Title & Info */}
            <div className="modal-info-col">
              <h2 className="modal-title" id="modal-movie-title">
                {name}
              </h2>

              <div className="modal-meta-bar">
                <span className="modal-meta-item">
                  <Star size={16} fill="#facc15" className="rating-star-icon" />
                  <span className="rating-highlight">
                    {rating ? `${rating} / 10` : 'Not Rated'}
                  </span>
                </span>

                <span>•</span>

                <span className="modal-meta-item">
                  <Calendar size={16} />
                  <span>{premiered || year || 'Unknown'}</span>
                </span>

                {runtime && (
                  <>
                    <span>•</span>
                    <span className="modal-meta-item">
                      <Clock size={16} />
                      <span>{runtime} min</span>
                    </span>
                  </>
                )}

                {status && (
                  <>
                    <span>•</span>
                    <span className="status-pill">{status}</span>
                  </>
                )}
              </div>

              {genres.length > 0 && (
                <div className="modal-genres">
                  {genres.map((g) => (
                    <span key={g} className="modal-genre-tag">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <h4 className="modal-section-title">Overview</h4>
              <p className="modal-overview-text" id="modal-overview-content">
                {cleanSummary}
              </p>

              <div className="modal-details-table">
                <div>
                  <div className="meta-field-label">Network / Channel</div>
                  <div className="meta-field-val">{network || 'N/A'}</div>
                </div>

                <div>
                  <div className="meta-field-label">Language</div>
                  <div className="meta-field-val">{language || 'English'}</div>
                </div>

                <div>
                  <div className="meta-field-label">Status</div>
                  <div className="meta-field-val">{status || 'N/A'}</div>
                </div>

                <div>
                  <div className="meta-field-label">Premiered Date</div>
                  <div className="meta-field-val">{premiered || 'N/A'}</div>
                </div>
              </div>

              {cast.length > 0 && (
                <div>
                  <h4 className="modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} />
                    <span>Featured Cast</span>
                  </h4>
                  <div className="cast-grid">
                    {cast.slice(0, 6).map((item, idx) => {
                      const person = item.person;
                      const character = item.character;
                      const avatarUrl = person?.image?.medium || character?.image?.medium;
                      return (
                        <div key={person?.id || idx} className="cast-member-card">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={person.name}
                              className="cast-avatar"
                            />
                          ) : (
                            <div className="cast-avatar-fallback">
                              <Users size={20} />
                            </div>
                          )}
                          <span className="cast-name">{person?.name}</span>
                          <span className="cast-char">{character?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="modal-footer-bar">
          {officialSite && (
            <a
              href={officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-site-btn"
              id="modal-official-site-btn"
            >
              <span>Official Site</span>
              <ExternalLink size={16} />
            </a>
          )}

          <button
            id="modal-close-bottom-btn"
            className="modal-close-footer-btn"
            onClick={onClose}
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
