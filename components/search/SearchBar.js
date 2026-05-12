'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * SearchBar — Search input with debounce and submit.
 *
 * @param {Object} props
 * @param {Function} props.onSearch - Called with query string
 * @param {string} [props.initialQuery] - Pre-fill search input
 */
export default function SearchBar({ onSearch, initialQuery = '' }) {
  const [value, setValue] = useState(initialQuery);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      setValue(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          id="search-input"
          className="search-bar__input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm bài hát, nghệ sĩ..."
          aria-label="Search YouTube"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="search-bar__submit"
          aria-label="Search"
          disabled={!value.trim()}
        >
          →
        </button>
      </form>
    </div>
  );
}
