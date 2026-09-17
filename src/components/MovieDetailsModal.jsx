import React, { useEffect, useState } from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Tv, 
  Globe, 
  Bookmark, 
  Film,
  Users,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { fetchShowDetailsWithCast } from '../services/tvmazeApi';

export default function MovieDetailsModal({
  movie,
  onClose,
  isFavorite = false,
  onToggleFavorite
}) {
  const [detailedMovie, setDetailedMovie] = useState(movie);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Lock background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Fetch enriched details with cast if not available
  useEffect(() => {
    if (!movie?.id) return;
    let isMounted = true;

    async function loadCastAndDetails() {
      if (movie.embeddedCast && movie.embeddedCast.length > 0) {
        setDetailedMovie(movie);
        return;
      }

      setLoadingDetails(true);
      try {
        const fullData = await fetchShowDetailsWithCast(movie.id);
        if (isMounted && fullData) {
          setDetailedMovie(fullData);
        }
      } catch (err) {
        console.warn('Could not fetch extra cast details:', err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }
    }

    loadCastAndDetails();
    return () => {
      isMounted = false;
    };
  }, [movie]);

  if (!movie) return null;

  const current = detailedMovie || movie;
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
    embeddedCast = []
  } = current;

  // TVMaze summary is raw HTML like <p>...</p>. Clean HTML tags or render safely.
  const cleanSummary = summary
    ? summary.replace(/<[^>]*>?/gm, '')
    : 'No synopsis available for this title.';

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
      aria-labelledby="modal-movie-title"
    >
      <div className="modal-card" id="movie-details-modal-box">
        {/* Top ✕ Close Icon Button */}
        <button
          id="modal-close-top-btn"
          className="modal-close-icon-btn"
          onClick={onClose}
          aria-label="Close modal"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Backdrop Banner Area */}
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

        {/* Scrollable Modal Content */}
        <div className="modal-scrollable-body">
          <div className="modal-content-grid">
            {/* Left Column: Poster & Quick Action */}
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

              {/* Watchlist Toggle */}
              <button
                id="modal-watchlist-toggle-btn"
                className={`modal-watchlist-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite(current)}
              >
                <Bookmark size={17} fill={isFavorite ? 'currentColor' : 'none'} />
                <span>{isFavorite ? 'Saved to Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Right Column: Title, Metadata, Overview */}
            <div className="modal-info-col">
              <h2 className="modal-title" id="modal-movie-title">
                {name}
              </h2>

              {/* Quick Meta Row */}
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
                  <span>{premiered || year || 'Unknown Release'}</span>
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

              {/* Genre Tags */}
              {genres && genres.length > 0 && (
                <div className="modal-genres">
                  {genres.map((g) => (
                    <span key={g} className="modal-genre-tag">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview / Synopsis */}
              <h4 className="modal-section-title">Overview</h4>
              <p className="modal-overview-text" id="modal-overview-content">
                {cleanSummary}
              </p>

              {/* Additional Meta Table */}
              <div className="modal-details-table">
                <div>
                  <div className="meta-field-label">Original Network / Channel</div>
                  <div className="meta-field-val">{network || 'N/A'}</div>
                </div>

                <div>
                  <div className="meta-field-label">Original Language</div>
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

              {/* Embedded Cast Members (if available) */}
              {embeddedCast && embeddedCast.length > 0 && (
                <div>
                  <h4 className="modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} />
                    <span>Featured Cast</span>
                  </h4>
                  <div className="cast-grid">
                    {embeddedCast.slice(0, 6).map((item, idx) => {
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

        {/* Modal Bottom Action Bar */}
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
