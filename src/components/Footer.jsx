import React from 'react';
import { Film, Code2, Globe, ExternalLink } from 'lucide-react';

export default function Footer({ onNavClick }) {
  return (
    <footer className="footer-wrap" id="main-footer">
      <div className="container">
        <div className="footer-top-row">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => onNavClick('home')}>
              <div className="brand-icon-wrap">
                <Film size={20} />
              </div>
              <span className="brand-title">
                Movie<span>Explorer</span>
              </span>
            </div>
            <p className="footer-desc">
              Your premier destination to discover, search, and track the best television series
              and movies from across the globe. Built with React and TVMaze Free API.
            </p>
          </div>

          {/* Links Group */}
          <div className="footer-links-group">
            <div>
              <h4 className="footer-col-heading">Navigation</h4>
              <ul className="footer-nav-list">
                <li className="footer-nav-item" onClick={() => onNavClick('home')}>
                  Home
                </li>
                <li className="footer-nav-item" onClick={() => onNavClick('movies')}>
                  Browse Movies
                </li>
                <li className="footer-nav-item" onClick={() => onNavClick('watchlist')}>
                  My Watchlist
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-heading">Popular Genres</h4>
              <ul className="footer-nav-list">
                <li className="footer-nav-item" onClick={() => onNavClick('movies', 'Action')}>
                  Action &amp; Adventure
                </li>
                <li className="footer-nav-item" onClick={() => onNavClick('movies', 'Science-Fiction')}>
                  Sci-Fi &amp; Fantasy
                </li>
                <li className="footer-nav-item" onClick={() => onNavClick('movies', 'Drama')}>
                  Drama &amp; Crime
                </li>
                <li className="footer-nav-item" onClick={() => onNavClick('movies', 'Comedy')}>
                  Comedy
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-heading">API &amp; Credits</h4>
              <ul className="footer-nav-list">
                <li>
                  <a
                    href="https://www.tvmaze.com/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-item"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>TVMaze API Docs</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-item"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Code2 size={14} />
                    <span>GitHub Repository</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="footer-bottom-bar">
          <p>© 2026 MovieExplorer. All rights reserved.</p>
          <div className="footer-api-credit">
            <span>Powered by free community data from</span>
            <a href="https://www.tvmaze.com" target="_blank" rel="noopener noreferrer">
              TVMaze
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
