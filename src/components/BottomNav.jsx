import React from 'react';
import { NAV_ITEMS } from '../config/navigation.js';

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="મોબાઈલ મુખ્ય નેવિગેશન">
      <div className="mobile-bottom-nav-inner" role="tablist">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`m-nav-${item.id}`}
              aria-selected={isActive ? 'true' : 'false'}
              aria-current={isActive ? 'page' : undefined}
              aria-controls={item.panelId}
              aria-label={item.label}
              className={`mobile-nav-btn ${isActive ? 'mobile-nav-active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <div className="mobile-nav-icon-wrap" aria-hidden="true">
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.85} />
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
