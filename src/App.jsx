import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import TrendingPreview from './components/TrendingPreview';
import MovieSearch from './components/MovieSearch';
import MovieGrid from './components/MovieGrid';
import MovieDetailsModal from './components/MovieDetailsModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { getShows, searchShows } from './services/tvmazeApi';
import { Sparkles, Compass } from 'lucide-react';

const STORAGE_KEY = 'movie_explorer_watchlist';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOption, setSortOption] = useState('featured');

  const [shows, setShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeMovie, setActiveMovie] = useState(null);
  const [toastText, setToastText] = useState(null);

  // Keep watchlist synchronized with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Could not save to storage', e);
    }
  }, [watchlist]);

  // Load initial shows on mount
  useEffect(() => {
    let isCurrent = true;
    async function init() {
      setLoading(true);
      try {
        const data = await getShows(0);
        if (isCurrent) setShows(data);
      } catch (err) {
        console.error('Failed to load initial shows', err);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }
    init();
    return () => {
      isCurrent = false;
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch search results when debounced query updates
  useEffect(() => {
    let isCurrent = true;
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }

    async function doSearch() {
      setLoading(true);
      try {
        const res = await searchShows(debouncedSearch);
        if (isCurrent) setSearchResults(res);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    doSearch();
    return () => {
      isCurrent = false;
    };
  }, [debouncedSearch]);

  const handleToggleWatchlist = (movie) => {
    if (!movie) return;
    const exists = watchlist.some((item) => item.id === movie.id);
    if (exists) {
      setWatchlist((prev) => prev.filter((item) => item.id !== movie.id));
      setToastText(`Removed "${movie.name}" from your Watchlist`);
    } else {
      setWatchlist((prev) => [movie, ...prev]);
      setToastText(`Added "${movie.name}" to your Watchlist`);
    }
  };

  const handleNavigate = (view, genre = null) => {
    setCurrentView(view);
    if (genre) setSelectedGenre(genre);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedGenre('All');
    setSortOption('featured');
  };

  const displayedList = useMemo(() => {
    let source = shows;
    if (currentView === 'watchlist') {
      source = watchlist;
    } else if (debouncedSearch.trim()) {
      source = searchResults;
    }

    let result = [...source];

    if (selectedGenre !== 'All') {
      result = result.filter(
        (m) => m.genres && m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    if (sortOption === 'rating-desc') {
      result.sort((a, b) => {
        const rA = a.rating ? parseFloat(a.rating) : -1;
        const rB = b.rating ? parseFloat(b.rating) : -1;
        return rB - rA;
      });
    } else if (sortOption === 'date-desc') {
      result.sort((a, b) => (b.premiered || '').localeCompare(a.premiered || ''));
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [currentView, debouncedSearch, searchResults, shows, watchlist, selectedGenre, sortOption]);

  return (
    <div className="app-container">
      <Navbar
        activeView={currentView}
        setActiveView={setCurrentView}
        watchlistCount={watchlist.length}
      />

      <main className="main-content">
        {/* Home Page */}
        {currentView === 'home' && (
          <div id="home-view-container">
            <HeroBanner
              onExploreClick={() => handleNavigate('movies')}
              onTrendingClick={() => {
                const el = document.getElementById('trending-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <TrendingPreview
              movies={shows}
              onSelectMovie={(m) => setActiveMovie(m)}
              favorites={watchlist}
              onToggleFavorite={handleToggleWatchlist}
              onViewAllClick={() => handleNavigate('movies')}
            />

            <section className="container" style={{ paddingBottom: '4rem' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}
              >
                <Sparkles size={36} color="var(--accent-gold)" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#fff' }}>
                  Ready to explore thousands of shows?
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '550px' }}>
                  Browse our interactive library with live search, genre filters, and cast information.
                </p>
                <button
                  className="hero-btn-primary"
                  onClick={() => handleNavigate('movies')}
                >
                  <Compass size={18} />
                  <span>Launch Movie Explorer</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Movies Listing Page */}
        {currentView === 'movies' && (
          <div className="container listing-header-area" id="movie-listing-view">
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900 }}>
                Explore <span style={{ color: 'var(--accent-gold)' }}>Movies &amp; Series</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Search through television shows, filter by genre, and discover your next obsession.
              </p>
            </div>

            <MovieSearch
              searchQuery={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
              sortBy={sortOption}
              onSortChange={setSortOption}
              totalResults={displayedList.length}
              isLoading={loading}
            />

            <div className="results-info-bar">
              <div>
                Showing <span className="results-count-bold">{displayedList.length}</span> titles
                {selectedGenre !== 'All' && <span> in <strong>{selectedGenre}</strong></span>}
                {debouncedSearch && <span> matching <strong>"{debouncedSearch}"</strong></span>}
              </div>
              {(selectedGenre !== 'All' || debouncedSearch || sortOption !== 'featured') && (
                <button
                  onClick={handleResetFilters}
                  style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', textDecoration: 'underline' }}
                >
                  Reset all filters
                </button>
              )}
            </div>

            <MovieGrid
              movies={displayedList}
              isLoading={loading}
              onSelectMovie={(m) => setActiveMovie(m)}
              favorites={watchlist}
              onToggleFavorite={handleToggleWatchlist}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Watchlist Page */}
        {currentView === 'watchlist' && (
          <div className="container listing-header-area" id="watchlist-view">
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900 }}>
                My <span style={{ color: 'var(--accent-red)' }}>Watchlist</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Titles saved to your personal list.
              </p>
            </div>

            {watchlist.length > 0 && (
              <div className="results-info-bar">
                <div>
                  <span className="results-count-bold">{watchlist.length}</span> titles saved
                </div>
              </div>
            )}

            <MovieGrid
              movies={watchlist}
              isLoading={false}
              onSelectMovie={(m) => setActiveMovie(m)}
              favorites={watchlist}
              onToggleFavorite={handleToggleWatchlist}
              onResetFilters={() => handleNavigate('movies')}
            />
          </div>
        )}
      </main>

      {/* Details Modal */}
      {activeMovie && (
        <MovieDetailsModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
          isFavorite={watchlist.some((item) => item.id === activeMovie.id)}
          onToggleFavorite={handleToggleWatchlist}
        />
      )}

      {/* Notification Toast */}
      <Toast
        message={toastText}
        onClose={() => setToastText(null)}
      />

      <Footer onNavClick={handleNavigate} />
    </div>
  );
}
