import React, { useState } from 'react';
import { PlayIcon, SearchIcon, MenuIcon, CloseIcon, ShieldIcon } from './Icons';

export default function Navbar({ currentRoute, navigate, onOpenSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', route: 'home' },
    { label: 'Movies', route: 'movies' },
    { label: 'Web Series', route: 'series' },
    { label: 'Genres', route: 'genres' },
    { label: 'Search', route: 'search' },
    { label: 'Admin', route: 'admin' },
  ];

  const handleNavigate = (route) => {
    setIsMobileMenuOpen(false);
    if (route === 'search') {
      onOpenSearch ? onOpenSearch() : navigate('search');
    } else {
      navigate(route);
    }
  };

  return (
    <header className="navbar" role="banner">
      <div className="container navbar-container">
        {/* Brand Identity */}
        <a 
          href="#home" 
          className="brand-logo" 
          onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
          aria-label="CineNova Home"
        >
          <div className="brand-icon" aria-hidden="true">
            <PlayIcon size={18} />
          </div>
          <span className="brand-text">CineNova</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <a
                key={item.route}
                href={`#${item.route}`}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.route);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls: Search & Admin & Mobile Toggle */}
        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => handleNavigate('search')}
            aria-label="Open Search"
            title="Search Movies & Series"
          >
            <SearchIcon size={19} />
          </button>

          <button
            type="button"
            className="btn btn-outline-gold btn-sm"
            onClick={() => handleNavigate('admin')}
            aria-label="Admin Portal"
            style={{ display: 'none' }} /* keep minimal on desktop, link is in nav */
          >
            <ShieldIcon size={16} /> Admin
          </button>

          <button
            type="button"
            className="icon-btn mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        {navItems.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <a
              key={item.route}
              href={`#${item.route}`}
              className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(item.route);
              }}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </header>
  );
}
