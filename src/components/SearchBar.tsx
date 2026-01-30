// ============================================
// CASE OPS - Search Bar Component
// ============================================

import { useState, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = 'Buscar...',
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
    },
    [query, onSearch]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      // Debounced search on type
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-bar-icon">🔍</span>
      <input
        type="search"
        className="form-input"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </form>
  );
}
