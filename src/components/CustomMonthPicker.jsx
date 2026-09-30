import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const MONTHS = [
  { index: 1, key: '01', gu: 'જાન્યુઆરી', shortGu: 'જાન્યુ', en: 'Jan', fullEn: 'January' },
  { index: 2, key: '02', gu: 'ફેબ્રુઆરી', shortGu: 'ફેબ્રુ', en: 'Feb', fullEn: 'February' },
  { index: 3, key: '03', gu: 'માર્ચ', shortGu: 'માર્ચ', en: 'Mar', fullEn: 'March' },
  { index: 4, key: '04', gu: 'એપ્રિલ', shortGu: 'એપ્રિલ', en: 'Apr', fullEn: 'April' },
  { index: 5, key: '05', gu: 'મે', shortGu: 'મે', en: 'May', fullEn: 'May' },
  { index: 6, key: '06', gu: 'જૂન', shortGu: 'જૂન', en: 'Jun', fullEn: 'June' },
  { index: 7, key: '07', gu: 'જુલાઈ', shortGu: 'જુલાઈ', en: 'Jul', fullEn: 'July' },
  { index: 8, key: '08', gu: 'ઓગસ્ટ', shortGu: 'ઓગસ્ટ', en: 'Aug', fullEn: 'August' },
  { index: 9, key: '09', gu: 'સપ્ટેમ્બર', shortGu: 'સપ્ટે', en: 'Sep', fullEn: 'September' },
  { index: 10, key: '10', gu: 'ઓક્ટોબર', shortGu: 'ઓક્ટો', en: 'Oct', fullEn: 'October' },
  { index: 11, key: '11', gu: 'નવેમ્બર', shortGu: 'નવે', en: 'Nov', fullEn: 'November' },
  { index: 12, key: '12', gu: 'ડિસેમ્બર', shortGu: 'ડિસે', en: 'Dec', fullEn: 'December' },
];

export default function CustomMonthPicker({ id, value, onChange, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse YYYY-MM
  const parseVal = (v) => {
    if (!v || typeof v !== 'string' || !v.includes('-')) {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: String(now.getMonth() + 1).padStart(2, '0'),
      };
    }
    const [y, m] = v.split('-');
    return {
      year: parseInt(y, 10) || new Date().getFullYear(),
      month: String(parseInt(m, 10) || 1).padStart(2, '0'),
    };
  };

  const parsed = parseVal(value);
  const [viewYear, setViewYear] = useState(parsed.year);

  // Sync viewYear when value changes externally
  useEffect(() => {
    if (value) {
      const p = parseVal(value);
      setViewYear(p.year);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (monthKey) => {
    const formatted = `${viewYear}-${monthKey}`;
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: { id, value: formatted },
        currentTarget: { id, value: formatted },
        value: formatted,
      });
    }
  };

  const handleThisMonth = () => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = String(now.getMonth() + 1).padStart(2, '0');
    setViewYear(curYear);
    handleSelect(curMonth);
  };

  const currentMonthData = MONTHS.find((m) => m.key === parsed.month);
  const displayText = currentMonthData
    ? `${currentMonthData.gu} ${parsed.year} (${currentMonthData.en} ${parsed.year})`
    : value || 'મહિનો અને વર્ષ પસંદ કરો';

  return (
    <div
      className={`custom-month-wrap ${isOpen ? 'is-open' : ''}`}
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden native input for compatibility */}
      <input
        type="month"
        id={id}
        value={value || ''}
        onChange={(e) => onChange && onChange(e)}
        tabIndex={-1}
        aria-hidden="true"
        className="custom-month-hidden-native"
      >
      </input>

      {/* Trigger Button */}
      <button
        type="button"
        className="custom-month-trigger"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={ariaLabel || 'તારીખ પસંદ કરો'}
      >
        <span className="custom-month-display-text">{displayText}</span>
        <Calendar size={18} className="custom-month-calendar-icon" aria-hidden="true" />
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div
          className="custom-month-popover"
          role="dialog"
          aria-label="મહિનો અને વર્ષ પસંદ કરો"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header with Year Navigation */}
          <div className="custom-month-header">
            <button
              type="button"
              className="custom-month-nav-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setViewYear((y) => y - 1);
              }}
              title="પાછલું વર્ષ"
              aria-label="પાછલું વર્ષ"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            <div className="custom-month-year-label">{viewYear}</div>

            <button
              type="button"
              className="custom-month-nav-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setViewYear((y) => y + 1);
              }}
              title="આગલું વર્ષ"
              aria-label="આગલું વર્ષ"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="custom-month-grid">
            {MONTHS.map((m) => {
              const isSelected = parsed.year === viewYear && parsed.month === m.key;
              const now = new Date();
              const isCurrentMonth = now.getFullYear() === viewYear && (now.getMonth() + 1) === m.index;

              return (
                <button
                  key={m.key}
                  type="button"
                  className={`custom-month-cell ${isSelected ? 'selected' : ''} ${isCurrentMonth ? 'current-month' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(m.key);
                  }}
                >
                  <span className="month-cell-gu">{m.gu}</span>
                  <span className="month-cell-en">{m.en}</span>
                  {isSelected && (
                    <Check size={14} className="month-cell-check" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Shortcuts */}
          <div className="custom-month-footer">
            <button
              type="button"
              className="custom-month-today-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleThisMonth();
              }}
            >
              આ મહિનો (This Month)
            </button>
            <button
              type="button"
              className="custom-month-close-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              બંધ કરો
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
