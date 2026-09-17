import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroBanner({ onExploreClick, onTrendingClick }) {
  return (
    <section className="hero-section" id="hero-banner">
      <div className="hero-background-art" />
      <div className="hero-glow-sphere hero-glow-1" />
      <div className="hero-glow-sphere hero-glow-2" />

      <div className="container hero-content">
        {/* Animated Pill Tag */}
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          <span>Unlimited Entertainment • Powered by TVMaze</span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-title" id="hero-heading">
          <span className="hero-title-gradient">DISCOVER MOVIES</span>
          <br />
          &amp; BINGE-WORTHY SHOWS
        </h1>

        {/* Engaging Description */}
        <p className="hero-desc">
          Explore and discover your favorite movies and television series from around the world.
          Search in real-time, view verified ratings, browse full cast lists, and curate your personal watchlist.
        </p>

        {/* CTA Actions */}
        <div className="hero-actions">
          <button
            id="hero-cta-explore-btn"
            className="hero-btn-primary"
            onClick={onExploreClick}
          >
            <span>Explore Now</span>
            <ArrowRight size={18} />
          </button>

          <button
            id="hero-cta-trending-btn"
            className="hero-btn-secondary"
            onClick={onTrendingClick}
          >
            <Play size={18} />
            <span>Top Rated Shows</span>
          </button>
        </div>

        {/* Metric Badges */}
        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <span className="stat-number">50,000+</span>
            <span className="stat-label">Titles Indexed</span>
          </div>
          <div className="hero-stat-item">
            <span className="stat-number">⭐ 8.5+</span>
            <span className="stat-label">Verified Ratings</span>
          </div>
          <div className="hero-stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Free API Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}
