import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import TrendingPreview from './components/TrendingPreview';
import MovieSearch from './components/MovieSearch';
import MovieGrid from './components/MovieGrid';
import MovieDetailsModal from './components/MovieDetailsModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { fetchAllShows, searchShows } from './services/tvmazeApi';
import { Sparkles, Bookmark, Compass } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'movie_explorer_watchlist_v1';

export default function App() {
  // Navigation View State ('home' | 'movies' | 'watchlist')
  const [activeView, setActiveView] = useState('home');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Data States
  const [initialShows, setInitialShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Watchlist / Favorites (persisted in localStorage)
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load watchlist from localStorage', e);
      return [];
    }
  });

  // Modal State
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  // Sync Watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setApiError(null);
      try {
        const data = await fetchAllShows(0);
        if (isMounted) {
          setInitialShows(data);
        }
      } catch (err) {
        if (isMounted) {
          setApiError('Unable to load shows from TVMaze. Please check your connection.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Execute search when debounced query changes
  useEffect(() => {
    let isMounted = true;
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    async function executeSearch() {
      setIsLoading(true);
      try {
        const results = await searchShows(debouncedQuery);
        if (isMounted) {
          setSearchResults(results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    executeSearch();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Handle Watchlist Toggle
  const toggleWatchlist = (movie) => {
    if (!movie) return;
    const exists = watchlist.some((item) => item.id === movie.id);
    if (exists) {
      setWatchlist((prev) => prev.filter((item) => item.id !== movie.id));
      setToastMessage(`Removed "${movie.name}" from your Watchlist`);
    } else {
      setWatchlist((prev) => [movie, ...prev]);
      setToastMessage(`Added "${movie.name}" to your Watchlist`);
    }
  };

  // Switch navigation and optionally set genre
  const navigateTo = (view, genre = null) => {
    setActiveView(view);
    if (genre) {
      setSelectedGenre(genre);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset all filters and search query
  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedGenre('All');
    setSortBy('featured');
  };

  // Determine movies list to display based on activeView & search
  const currentBaseList = useMemo(() => {
    if (activeView === 'watchlist') {
      return watchlist;
    }
    if (debouncedQuery.trim()) {
      return searchResults;
    }
    return initialShows;
  }, [activeView, debouncedQuery, searchResults, initialShows, watchlist]);

  // Apply genre filtering and sorting
  const filteredAndSortedMovies = useMemo(() => {
    let list = [...currentBaseList];

    // Filter by genre
    if (selectedGenre !== 'All') {
      list = list.filter(
        (m) => m.genres && m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'rating-desc') {
      list.sort((a, b) => {
        const rA = a.rating ? parseFloat(a.rating) : -1;
        const rB = b.rating ? parseFloat(b.rating) : -1;
        return rB - rA;
      });
    } else if (sortBy === 'date-desc') {
      list.sort((a, b) => {
        const dA = a.premiered || '';
        const dB = b.premiered || '';
        return dB.localeCompare(dA);
      });
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [currentBaseList, selectedGenre, sortBy]);

  return (
    <div className="app-container">
      {/* Top Sticky Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        watchlistCount={watchlist.length}
      />

      <main className="main-content">
        {/* =========================================================
            VIEW 1: HOME PAGE
            ========================================================= */}
        {activeView === 'home' && (
          <div id="home-view-container">
            {/* Hero Banner */}
            <HeroBanner
              onExploreClick={() => navigateTo('movies')}
              onTrendingClick={() => {
                const el = document.getElementById('trending-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Trending / High-Rated Spotlight */}
            <TrendingPreview
              movies={initialShows}
              onSelectMovie={(movie) => setSelectedMovie(movie)}
              favorites={watchlist}
              onToggleFavorite={toggleWatchlist}
              onViewAllClick={() => navigateTo('movies')}
            />

            {/* Quick Discover CTA Banner */}
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
                  Browse our complete interactive library with lightning fast live search, genre filters, and cast information.
                </p>
                <button
                  className="hero-btn-primary"
                  onClick={() => navigateTo('movies')}
                >
                  <Compass size={18} />
                  <span>Launch Movie Explorer</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================
            VIEW 2: MOVIE LISTING & SEARCH PAGE
            ========================================================= */}
        {activeView === 'movies' && (
          <div className="container listing-header-area" id="movie-listing-view">
            {/* Page Title & Subtitle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900 }}>
                Explore <span style={{ color: 'var(--accent-gold)' }}>Movies &amp; Series</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Search through thousands of television shows, filter by genre, and discover your next obsession.
              </p>
            </div>

            {/* Search, Filter & Sort Controls */}
            <MovieSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalResults={filteredAndSortedMovies.length}
              isLoading={isLoading}
            />

            {/* Live Results Info Line */}
            <div className="results-info-bar">
              <div>
                Showing <span className="results-count-bold">{filteredAndSortedMovies.length}</span> titles
                {selectedGenre !== 'All' && <span> in <strong>{selectedGenre}</strong></span>}
                {debouncedQuery && <span> matching <strong>"{debouncedQuery}"</strong></span>}
              </div>
              {(selectedGenre !== 'All' || debouncedQuery || sortBy !== 'featured') && (
                <button
                  onClick={handleResetFilters}
                  style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', textDecoration: 'underline' }}
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Movie Cards Grid */}
            <MovieGrid
              movies={filteredAndSortedMovies}
              isLoading={isLoading}
              onSelectMovie={(movie) => setSelectedMovie(movie)}
              favorites={watchlist}
              onToggleFavorite={toggleWatchlist}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* =========================================================
            VIEW 3: WATCHLIST PAGE
            ========================================================= */}
        {activeView === 'watchlist' && (
          <div className="container listing-header-area" id="watchlist-view">
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900 }}>
                My <span style={{ color: 'var(--accent-red)' }}>Watchlist</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Titles you've saved to watch later. Saved directly in your browser.
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
              onSelectMovie={(movie) => setSelectedMovie(movie)}
              favorites={watchlist}
              onToggleFavorite={toggleWatchlist}
              onResetFilters={() => navigateTo('movies')}
            />
          </div>
        )}
      </main>

      {/* Interactive Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={watchlist.some((item) => item.id === selectedMovie.id)}
          onToggleFavorite={toggleWatchlist}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Footer */}
      <Footer onNavClick={navigateTo} />
    </div>
  );
}
