import React from 'react';
import { PlayIcon, ShieldIcon } from './Icons';

export default function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Manifesto */}
          <div className="footer-brand">
            <div className="brand-logo" style={{ marginBottom: '14px' }}>
              <div className="brand-icon" aria-hidden="true">
                <PlayIcon size={18} />
              </div>
              <span className="brand-text">CineNova</span>
            </div>
            <p style={{ color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '8px' }}>
              &ldquo;Your stories. Your screen.&rdquo;
            </p>
            <p>
              A premier independent streaming service crafted for original cinema, creator-owned stories, and legally authorized web series.
            </p>
          </div>

          {/* Catalog Links */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }}>
                  Featured Stories
                </a>
              </li>
              <li>
                <a href="#movies" onClick={(e) => { e.preventDefault(); navigate('movies'); }}>
                  Authorized Movies
                </a>
              </li>
              <li>
                <a href="#series" onClick={(e) => { e.preventDefault(); navigate('series'); }}>
                  Original Series
                </a>
              </li>
              <li>
                <a href="#genres" onClick={(e) => { e.preventDefault(); navigate('genres'); }}>
                  Browse by Genre
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="footer-col">
            <h4>Integrity</h4>
            <ul className="footer-links">
              <li>
                <a href="#compliance" onClick={(e) => { e.preventDefault(); alert("CineNova Compliance: All titles are hosted under explicit rights ownership or direct licensing from copyright holders. CineNova does not index, scrape, or support external pirated streams."); }}>
                  Content Licensing
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: Streaming is provided for personal, non-commercial entertainment of authorized media."); }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Notice: CineNova preserves privacy with local client-side persistence and zero tracker selling."); }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact: licensing@cinenova.stream"); }}>
                  Rights Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Administration */}
          <div className="footer-col">
            <h4>Management</h4>
            <ul className="footer-links">
              <li>
                <a href="#admin" onClick={(e) => { e.preventDefault(); navigate('admin'); }}>
                  Creator Dashboard
                </a>
              </li>
              <li>
                <a href="#admin-login" onClick={(e) => { e.preventDefault(); navigate('admin-login'); }}>
                  Admin Login
                </a>
              </li>
              <li>
                <a href="#search" onClick={(e) => { e.preventDefault(); navigate('search'); }}>
                  Catalog Search
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="footer-bottom">
          <div>
            &copy; {currentYear} CineNova Platform. All rights reserved. Exclusively authorized content.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldIcon size={16} /> Verified Independent Streaming Distribution
          </div>
        </div>
      </div>
    </footer>
  );
}
