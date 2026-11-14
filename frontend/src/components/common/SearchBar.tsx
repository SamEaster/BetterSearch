import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  placeholder?: string;
  autoFocus?: boolean;
  onSearchSubmit?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'compact',
  placeholder = 'What do you want to learn or watch intentionally today?',
  autoFocus = false,
  onSearchSubmit,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Global keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    } else {
      // Preserve current filter params if on search page, or set fresh query
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set('q', trimmed);
      navigate(`/search?${currentParams.toString()}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.searchForm} ${
        variant === 'hero' ? styles.variantHero : styles.variantCompact
      }`}
    >
      <div className={styles.inputWrapper}>
        <div className={styles.iconPrefix}>
          <Search size={variant === 'hero' ? 22 : 18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          id="main-search-input"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {variant === 'compact' && !query && (
          <span className={styles.kbd}>/</span>
        )}

        {variant === 'hero' && (
          <button type="submit" className={styles.submitButton} id="hero-search-submit">
            <span>Search</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </form>
  );
};
