import React, { useRef } from 'react';
import { NAV_ITEMS } from '../config/navigation.js';
import ThemeToggle from './ThemeToggle.jsx';
import PageSearch from './PageSearch.jsx';

export default function NavBar({ activeTab, onSelectTab }) {
  const navListRef = useRef(null);

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + direction + NAV_ITEMS.length) % NAV_ITEMS.length;
      const nextItem = NAV_ITEMS[nextIndex];
      onSelectTab(nextItem.id);
      const buttons = navListRef.current?.querySelectorAll('button[role="tab"]');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus();
      }
    }
  };

  return (
    <header className="top-navbar">
      <div className="wrap nav-wrap">
        {/* Brand Area */}
        <div
          className="nav-brand"
          onClick={() => onSelectTab('check')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectTab('check');
            }
          }}
          aria-label="સબસિડી સાથી - Subsidy Sathi"
        >
          <img
            src="/logo-light.png"
            alt="સબસિડી સાથી · Subsidy Sathi"
            className="nav-brand-logo nav-brand-logo-light"
          />
          <img
            src="/logo-dark.png"
            alt="સબસિડી સાથી · Subsidy Sathi"
            className="nav-brand-logo nav-brand-logo-dark"
          />
        </div>

        {/* In-Page Search Field (between Logo and Navigation Menu) */}
        <PageSearch activeTab={activeTab} />

        {/* Desktop / Tablet Navigation Menu (shifted right next to actions) */}
        <nav className="desktop-nav" aria-label="મુખ્ય નેવિગેશન">
          <div className="nav-menu-list" role="tablist" ref={navListRef}>
            {NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`nav-tab-${item.id}`}
                  aria-selected={isActive ? 'true' : 'false'}
                  aria-current={isActive ? 'page' : undefined}
                  aria-controls={item.panelId}
                  tabIndex={isActive ? 0 : -1}
                  className={`nav-item-btn ${isActive ? 'nav-item-active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                >
                  <Icon size={17} className="nav-item-icon" aria-hidden="true" />
                  <span className="nav-item-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Far Right: Theme Toggle */}
        <div className="nav-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
