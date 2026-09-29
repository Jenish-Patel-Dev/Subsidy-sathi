import React from 'react';
import { Calculator, Percent, Layers, MapPin, FileCheck } from 'lucide-react';

const TAB_LIST = [
  { id: 'check', label: 'મારી પાત્રતા', icon: Calculator },
  { id: 'rates', label: 'સહાયના દર', icon: Percent },
  { id: 'other', label: 'અન્ય સહાય', icon: Layers },
  { id: 'taluka', label: 'તાલુકા શ્રેણી', icon: MapPin },
  { id: 'rules', label: 'નિયમો અને શરતો', icon: FileCheck },
];

export default function Tabs({ activeTab, onSelectTab }) {
  return (
    <>
      {/* 1. Desktop & Tablet Sticky Top Navigation Bar (>= 768px) */}
      <nav className="tabs desktop-tabs" aria-label="વિભાગો">
        <div className="wrap">
          <div className="tabs-grid" role="tablist">
            {TAB_LIST.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`t-${tab.id}`}
                  aria-selected={isSelected ? 'true' : 'false'}
                  aria-controls={`p-${tab.id}`}
                  data-tab={tab.id}
                  className={`tab-btn ${isSelected ? 'tab-btn-active' : ''}`}
                  onClick={() => onSelectTab(tab.id)}
                >
                  <Icon size={17} className="tab-icon" aria-hidden="true" />
                  <span className="tab-label">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. Mobile Fixed Bottom Navigation Bar (< 768px) */}
      <nav className="mobile-bottom-nav" aria-label="મોબાઈલ વિભાગો">
        <div className="mobile-bottom-nav-inner" role="tablist">
          {TAB_LIST.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`m-t-${tab.id}`}
                aria-selected={isSelected ? 'true' : 'false'}
                aria-controls={`p-${tab.id}`}
                aria-label={tab.label}
                data-tab={tab.id}
                className={`mobile-tab-btn ${isSelected ? 'mobile-tab-active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
              >
                <div className="mobile-tab-icon-wrap">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span className="mobile-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
