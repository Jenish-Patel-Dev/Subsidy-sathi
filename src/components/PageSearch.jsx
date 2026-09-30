import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

export default function PageSearch({ activeTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Check if browser natively supports CSS Custom Highlight API (Zero DOM manipulation)
  const hasCustomHighlight = typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';

  // Helper to remove fallback <mark> elements
  const cleanFallbackMarks = useCallback(() => {
    const marks = document.querySelectorAll('mark.page-search-mark');
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) {
          parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
        parent.normalize();
      }
    });
  }, []);

  // Clear all highlights (both native and fallback)
  const clearHighlights = useCallback(() => {
    if (hasCustomHighlight) {
      try {
        CSS.highlights.delete('page-search-match');
        CSS.highlights.delete('page-search-current');
      } catch (e) {
        // ignore
      }
    }
    cleanFallbackMarks();
  }, [hasCustomHighlight, cleanFallbackMarks]);

  // Scroll to a specific match
  const scrollToMatch = useCallback((targetMatch) => {
    if (!targetMatch) return;
    try {
      const node = targetMatch.range ? targetMatch.range.startContainer : targetMatch.element;
      const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Search execution
  const executeSearch = useCallback(() => {
    const q = searchQuery.trim().toLowerCase();
    clearHighlights();

    if (!q || q.length < 2) {
      setMatches([]);
      setCurrentIndex(0);
      return;
    }

    // Identify visible active page section
    const activeSection =
      document.querySelector(`section[data-panel="${activeTab}"]`) ||
      document.querySelector('main section:not([hidden])') ||
      document.querySelector('main');

    if (!activeSection) {
      setMatches([]);
      setCurrentIndex(0);
      return;
    }

    // Traverse visible text nodes
    const foundMatches = [];
    const walker = document.createTreeWalker(
      activeSection,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.textContent || !node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          const tag = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'textarea', 'input', 'select', 'svg'].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('[hidden]') || parent.offsetParent === null) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.classList.contains('page-search-mark')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      const text = currentNode.textContent;
      const lowerText = text.toLowerCase();
      let pos = 0;

      while ((pos = lowerText.indexOf(q, pos)) !== -1) {
        try {
          const range = new Range();
          range.setStart(currentNode, pos);
          range.setEnd(currentNode, pos + q.length);
          foundMatches.push({
            range,
            node: currentNode,
            start: pos,
            length: q.length,
          });
        } catch (e) {
          // ignore
        }
        pos += q.length;
      }
    }

    setMatches(foundMatches);
    setCurrentIndex(foundMatches.length > 0 ? 0 : 0);

    if (foundMatches.length > 0) {
      if (hasCustomHighlight) {
        // Native CSS Custom Highlight API
        try {
          const allRanges = foundMatches.map((m) => m.range);
          const matchHighlight = new Highlight(...allRanges);
          CSS.highlights.set('page-search-match', matchHighlight);

          const curHighlight = new Highlight(foundMatches[0].range);
          CSS.highlights.set('page-search-current', curHighlight);
        } catch (e) {
          // ignore
        }
      } else {
        // Fallback for older browsers using <mark>
        // Walk backwards through matches to maintain text offsets
        for (let i = foundMatches.length - 1; i >= 0; i--) {
          const m = foundMatches[i];
          try {
            const mark = document.createElement('mark');
            mark.className = `page-search-mark page-search-match ${i === 0 ? 'page-search-current' : ''}`;
            m.range.surroundContents(mark);
            m.element = mark;
          } catch (e) {
            // ignore range errors on complex nodes
          }
        }
      }

      // Scroll to the first match
      scrollToMatch(foundMatches[0]);
    }
  }, [searchQuery, activeTab, hasCustomHighlight, clearHighlights, scrollToMatch]);

  // Update current active highlight when currentIndex changes
  useEffect(() => {
    if (matches.length === 0) return;

    if (hasCustomHighlight) {
      try {
        const curMatch = matches[currentIndex];
        if (curMatch && curMatch.range) {
          const curHighlight = new Highlight(curMatch.range);
          CSS.highlights.set('page-search-current', curHighlight);
        }
      } catch (e) {
        // ignore
      }
    } else {
      // Update fallback mark classes
      document.querySelectorAll('mark.page-search-mark').forEach((mark, idx) => {
        if (idx === currentIndex) {
          mark.classList.add('page-search-current');
        } else {
          mark.classList.remove('page-search-current');
        }
      });
    }

    scrollToMatch(matches[currentIndex]);
  }, [currentIndex, matches, hasCustomHighlight, scrollToMatch]);

  // Debounced search when query or activeTab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch();
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, executeSearch]);

  // Clean up highlights on unmount
  useEffect(() => {
    return () => {
      clearHighlights();
    };
  }, [clearHighlights]);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Navigation handlers
  const handleNext = () => {
    if (matches.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  };

  const handlePrev = () => {
    if (matches.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchQuery('');
      inputRef.current?.blur();
    }
  };

  const hasQuery = searchQuery.trim().length > 0;
  const matchTotal = matches.length;

  return (
    <div className={`nav-search-wrap ${isFocused ? 'focused' : ''} ${hasQuery ? 'has-query' : ''}`}>
      <Search size={16} className="nav-search-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        className="nav-search-input"
        placeholder="પેજમાં શોધો... (Ctrl+K)"
        aria-label="પેજમાં શોધો"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      />

      {/* Counter and Navigation controls */}
      {hasQuery && (
        <div className="nav-search-controls">
          <span className={`nav-search-counter ${matchTotal === 0 ? 'empty' : ''}`}>
            {matchTotal > 0 ? `${currentIndex + 1}/${matchTotal}` : '0 મળ્યા'}
          </span>

          {matchTotal > 1 && (
            <div className="nav-search-arrows">
              <button
                type="button"
                className="nav-search-btn"
                onClick={handlePrev}
                title="પાછળનું પરિણામ (Shift+Enter)"
                aria-label="પાછળનું પરિણામ"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="nav-search-btn"
                onClick={handleNext}
                title="આગળનું પરિણામ (Enter)"
                aria-label="આગળનું પરિણામ"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          )}

          <button
            type="button"
            className="nav-search-clear-btn"
            onClick={() => {
              setSearchQuery('');
              clearHighlights();
              inputRef.current?.focus();
            }}
            title="શોધ સાફ કરો (Esc)"
            aria-label="શોધ સાફ કરો"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Keyboard Shortcut Hint (Shown when idle & empty) */}
      {!hasQuery && (
        <span className="nav-search-kbd" title="શોધવા માટે Ctrl+K દબાવો">
          Ctrl+K
        </span>
      )}
    </div>
  );
}
