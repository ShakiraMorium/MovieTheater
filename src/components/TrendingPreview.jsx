import React from 'react';
import MovieCard from './MovieCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function TrendingPreview({
  movies = [],
  onSelectMovie,
  favorites = [],
  onToggleFavorite,
  onViewAllClick
}) {
  // Take top 4-8 highest rated or featured shows
  const topShows = [...movies]
    .filter((m) => m.rating && parseFloat(m.rating) >= 8.0)
    .slice(0, 4);

  if (topShows.length === 0) return null;

  return (
    <section className="container" style={{ padding: '2rem 1.5rem 4rem' }} id="trending-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-badge">CRITICALLY ACCLAIMED</span>
          <h2 className="section-title">Trending &amp; Top Rated</h2>
        </div>

        <button
          id="trending-view-all-btn"
          className="section-link-btn"
          onClick={onViewAllClick}
        >
          <span>Explore All Titles</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="movie-grid">
        {topShows.map((movie) => {
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
    </section>
  );
}
