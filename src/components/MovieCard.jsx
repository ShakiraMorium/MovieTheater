import React, { useState } from 'react';
import { Star, Calendar, Film, Bookmark, ArrowUpRight } from 'lucide-react';

export default function MovieCard({
  movie,
  onSelectMovie,
  isFavorite = false,
  onToggleFavorite
}) {
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const {
    id,
    name,
    year,
    premiered,
    rating,
    genres = [],
    posterMedium,
    image
  } = movie;

  const posterSrc = posterMedium || image;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  return (
    <article className="movie-card" id={`movie-card-${id}`}>
      {/* Poster Media Box */}
      <div 
        className="card-poster-container"
        onClick={() => onSelectMovie(movie)}
        style={{ cursor: 'pointer' }}
      >
        {posterSrc && !imgError ? (
          <img
            src={posterSrc}
            alt={`${name} poster`}
            className="card-poster-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-poster-fallback">
            <Film size={36} />
            <span>No Poster Available</span>
          </div>
        )}

        {/* Rating Floating Badge */}
        <div className="card-rating-badge" title="Viewer Rating">
          <Star size={13} className="rating-star-icon" fill="#facc15" />
          <span>{rating ? rating : 'N/A'}</span>
        </div>

        {/* Bookmark Quick Toggle Button */}
        <button
          className={`card-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
          title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Bookmark size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Body Details */}
      <div className="card-content">
        <h3 className="card-title" title={name}>
          {name}
        </h3>

        <div className="card-meta-line">
          <span className="card-meta-item">
            <Star size={14} className="rating-star-icon" fill="#facc15" />
            <strong>{rating ? rating : 'N/A'}</strong>
          </span>
          <span>•</span>
          <span className="card-meta-item">
            <Calendar size={14} />
            <span>{year !== 'N/A' ? year : (premiered ? premiered.slice(0, 4) : 'TBA')}</span>
          </span>
        </div>

        {/* Genre Tags */}
        <div className="card-genres-row">
          {genres.slice(0, 2).map((genre) => (
            <span key={genre} className="card-genre-pill">
              {genre}
            </span>
          ))}
          {genres.length > 2 && (
            <span className="card-genre-pill">+{genres.length - 2}</span>
          )}
        </div>

        {/* See Details Button */}
        <button
          id={`see-details-btn-${id}`}
          className="card-details-btn"
          onClick={() => onSelectMovie(movie)}
        >
          <span>See Details</span>
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}
