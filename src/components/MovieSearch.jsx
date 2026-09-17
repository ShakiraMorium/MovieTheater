import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const GENRE_LIST = [
  'All',
  'Action',
  'Drama',
  'Comedy',
  'Science-Fiction',
  'Crime',
  'Adventure',
  'Thriller',
  'Animation',
  'Horror',
  'Mystery',
  'Romance'
];

export default function MovieSearch({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreSelect,
  sortBy,
  onSortChange,
  totalResults = 0,
  isLoading = false
}) {
  return (
    <div className="search-box-card" id="movie-search-section">
      {/* Search Input Bar */}
      <div className="search-input-wrapper">
        <Search size={22} className="search-input-icon" />
        <input
          id="movie-search-input"
          type="text"
          className="search-input"
          placeholder="Search for a movie, show, or title (e.g. Batman, Stranger Things, Girls)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Genre Pills & Sorting Row */}
      <div className="filter-controls-row">
        {/* Genre Pills */}
        <div className="genre-pills-list" role="tablist" aria-label="Genre Filters">
          {GENRE_LIST.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                id={`filter-genre-${genre.toLowerCase()}`}
                className={`genre-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onGenreSelect(genre)}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="sort-select-wrapper">
          <SlidersHorizontal size={15} style={{ color: 'var(--text-muted)' }} />
          <label htmlFor="sort-by-select" className="sort-label">
            Sort By:
          </label>
          <select
            id="sort-by-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Featured / Default</option>
            <option value="rating-desc">Highest Rated (⭐)</option>
            <option value="date-desc">Newest Release (📅)</option>
            <option value="name-asc">Title (A - Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
