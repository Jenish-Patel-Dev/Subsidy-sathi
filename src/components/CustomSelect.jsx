import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function CustomSelect({
  id,
  value,
  onChange,
  options = [],
  groups = null,
  searchable = true,
  placeholder = 'પસંદ કરો...',
  ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  // Flatten all options to calculate selected option and for linear keyboard navigation
  const allOptions = React.useMemo(() => {
    if (groups) {
      return groups.flatMap((g) => g.options || []);
    }
    return options;
  }, [groups, options]);

  // Find currently selected option
  const selectedOption = allOptions.find((opt) => String(opt.value) === String(value));

  // Filter options based on search query
  const filteredGroups = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      if (groups) return groups;
      return [{ label: null, options }];
    }

    if (groups) {
      return groups
        .map((g) => ({
          ...g,
          options: (g.options || []).filter((opt) => {
            const labelStr = (opt.label || '').toLowerCase();
            const valStr = String(opt.value || '').toLowerCase();
            const searchTerms = (opt.searchTerms || '').toLowerCase();
            return labelStr.includes(q) || valStr.includes(q) || searchTerms.includes(q);
          }),
        }))
        .filter((g) => g.options.length > 0);
    }

    const filtered = options.filter((opt) => {
      const labelStr = (opt.label || '').toLowerCase();
      const valStr = String(opt.value || '').toLowerCase();
      const searchTerms = (opt.searchTerms || '').toLowerCase();
      return labelStr.includes(q) || valStr.includes(q) || searchTerms.includes(q);
    });

    return [{ label: null, options: filtered }];
  }, [groups, options, searchQuery]);

  const flatFilteredOptions = React.useMemo(() => {
    return filteredGroups.flatMap((g) => g.options || []);
  }, [filteredGroups]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
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

  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }
  }, [isOpen, searchable]);

  // Select an option
  const handleSelect = (val) => {
    setIsOpen(false);
    setSearchQuery('');
    if (onChange) {
      // Create a mock event in case caller expects e.target.value
      onChange({
        target: { id: selectId, value: val },
        currentTarget: { id: selectId, value: val },
        value: val,
      });
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev + 1;
        return next < flatFilteredOptions.length ? next : 0;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev - 1;
        return next >= 0 ? next : flatFilteredOptions.length - 1;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < flatFilteredOptions.length) {
        handleSelect(flatFilteredOptions[highlightedIndex].value);
      }
    }
  };

  return (
    <div
      className={`custom-select-wrap ${isOpen ? 'is-open' : ''}`}
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden native select for accessibility & form compatibility */}
      <select
        id={selectId}
        value={value}
        onChange={(e) => handleSelect(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="custom-select-hidden-native"
      >
        {allOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Visible Custom Select Trigger */}
      <button
        type="button"
        className="custom-select-trigger"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
      >
        <div className="custom-select-display">
          {selectedOption ? (
            <span className="custom-select-value-text">
              {selectedOption.renderLabel ? selectedOption.renderLabel : selectedOption.label}
            </span>
          ) : (
            <span className="custom-select-placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={18} className={`custom-select-chevron ${isOpen ? 'rotated' : ''}`} aria-hidden="true" />
      </button>

      {/* Dropdown Popover List */}
      {isOpen && (
        <div
          className="custom-select-dropdown"
          role="listbox"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {searchable && (
            <div className="custom-select-search-wrap">
              <Search size={15} className="custom-select-search-icon" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                className="custom-select-search-input"
                placeholder="શોધો... (Search)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="custom-select-options-list" ref={listRef}>
            {flatFilteredOptions.length === 0 ? (
              <div className="custom-select-empty">કોઈ પરિણામ મળ્યું નથી</div>
            ) : (
              filteredGroups.map((group, gIdx) => (
                <div key={group.label || gIdx} className="custom-select-group">
                  {group.label && (
                    <div className="custom-select-group-header">
                      {group.label}
                    </div>
                  )}
                  {group.options.map((opt) => {
                    const isSelected = String(opt.value) === String(value);
                    const globalIdx = flatFilteredOptions.indexOf(opt);
                    const isHighlighted = highlightedIndex === globalIdx;

                    return (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        className={`custom-select-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect(opt.value);
                        }}
                        onMouseEnter={() => setHighlightedIndex(globalIdx)}
                      >
                        <div className="custom-select-option-content">
                          <span className="custom-select-option-label">
                            {opt.label}
                          </span>
                          {opt.sublabel && (
                            <span className="custom-select-option-sublabel">
                              {opt.sublabel}
                            </span>
                          )}
                        </div>

                        <div className="custom-select-option-right">
                          {opt.badge && (
                            <span className={`custom-select-badge ${opt.badgeType || ''}`}>
                              {opt.badge}
                            </span>
                          )}
                          {isSelected && (
                            <Check size={16} className="custom-select-check-icon" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
