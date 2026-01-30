// ============================================
// CASE OPS - Global Search Page
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
// CORRECCIÓN: Importaciones directas para evitar fallos
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { ListItem } from '../../components/ListItem';
import { globalSearch } from '../../db/repositories';
import type { Case, Document } from '../../types';

// Componente local para resaltar texto
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-amber-500/30 text-amber-200 font-semibold px-0.5 rounded">
            {part}
          </span>
        ) : part
      )}
    </span>
  );
};

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({
    cases: [], documents: [], spans: [], facts: [], partidas: [], events: [], strategies: [], tasks: []
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length < 2) {
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const searchResults = await globalSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalResults = Object.values(results).flat().length;

  return (
    <div className="pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Buscar</h1>
        <SearchBar onSearch={handleSearch} placeholder="Buscar en todo..." autoFocus />
      </div>

      {loading && <div className="text-center p-8 text-slate-500">Buscando...</div>}

      {!loading && hasSearched && totalResults === 0 && (
        <EmptyState icon="🔍" title="Sin resultados" description={`No se encontró nada para "${query}"`} />
      )}

      {!loading && hasSearched && totalResults > 0 && (
        <div className="space-y-6">
          {results.cases.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Casos</h2>
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
                {results.cases.map((item: Case) => (
                  <Link key={item.id} to={`/cases/${item.id}`}>
                    <ListItem 
                      icon="⚖️" 
                      title={<HighlightText text={item.title} highlight={query} />} 
                      subtitle={item.court} 
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
          
          {results.documents.length > 0 && (
             <section>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Documentos</h2>
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
                {results.documents.map((item: Document) => (
                  <Link key={item.id} to={`/documents/${item.id}`}>
                    <ListItem 
                      icon="📄" 
                      title={<HighlightText text={item.title} highlight={query} />} 
                      subtitle={item.docType} 
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
