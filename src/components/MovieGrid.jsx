import React from 'react';
import MovieCard from './MovieCard';
import { Film, RefreshCw } from 'lucide-react';

export default function MovieGrid({
  movies = [],
  isLoading = false,
  onSelectMovie,
  favorites = [],
  onToggleFavorite,
  onResetFilters
}) {
  // Skeleton Loading Grid
  if (isLoading) {
    return (
      <div className="movie-grid" id="movie-grid-loading">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="skeleton-card" />
        ))}
      </div>
    );
  }

  // Empty Results State
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state-box" id="empty-movies-state">
        <div className="empty-icon-circle">
          <Film size={36} />
        </div>
        <h3 className="empty-title">No Movies or Shows Found</h3>
        <p className="empty-desc">
          We couldn't find any titles matching your query or selected filters.
          Try adjusting your search keywords or resetting filters.
        </p>
        {onResetFilters && (
          <button
            id="reset-filters-btn"
            className="nav-cta-btn"
            onClick={onResetFilters}
          >
            <RefreshCw size={16} />
            <span>Reset Filters &amp; Search</span>
          </button>
        )}
      </div>
    );
  }

  // Populated Grid
  return (
    <div className="movie-grid" id="movie-grid-container">
      {movies.map((movie) => {
        const isFav = favorites.some((fav) => fav.id === movie.id);
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelectMovie={onSelectMovie}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
}
