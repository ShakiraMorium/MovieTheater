import React, { useState } from 'react';
import { Film, Compass, Bookmark, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, watchlistCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-header" id="main-header">
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <div 
          className="navbar-brand" 
          id="brand-logo"
          role="button"
          tabIndex={0}
          onClick={() => handleNavClick('home')}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon-wrap">
            <Film size={22} />
          </div>
          <span className="brand-title">
            Movie<span>Explorer</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          <button
            id="nav-home-btn"
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>

          <button
            id="nav-movies-btn"
            className={`nav-link ${activeView === 'movies' ? 'active' : ''}`}
            onClick={() => handleNavClick('movies')}
          >
            <Compass size={16} />
            Browse Movies
          </button>

          <button
            id="nav-watchlist-btn"
            className={`nav-link ${activeView === 'watchlist' ? 'active' : ''}`}
            onClick={() => handleNavClick('watchlist')}
          >
            <Bookmark size={16} />
            Watchlist
            {watchlistCount > 0 && (
              <span className="nav-badge" id="watchlist-count-badge">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            id="nav-cta-explore"
            className="nav-cta-btn"
            onClick={() => handleNavClick('movies')}
          >
            <Sparkles size={16} />
            Explore Now
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          id="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" id="mobile-navigation-drawer">
          <button
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeView === 'movies' ? 'active' : ''}`}
            onClick={() => handleNavClick('movies')}
          >
            <Compass size={16} />
            Browse Movies
          </button>
          <button
            className={`nav-link ${activeView === 'watchlist' ? 'active' : ''}`}
            onClick={() => handleNavClick('watchlist')}
          >
            <Bookmark size={16} />
            Watchlist ({watchlistCount})
          </button>
          <button
            className="nav-cta-btn"
            style={{ justifyContent: 'center' }}
            onClick={() => handleNavClick('movies')}
          >
            <Sparkles size={16} />
            Explore Now
          </button>
        </div>
      )}
    </header>
  );
}
