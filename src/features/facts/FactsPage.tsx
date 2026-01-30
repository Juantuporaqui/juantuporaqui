// ============================================
// CASE OPS - Facts (Hechos) List Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAB, EmptyState, ListItem } from '../../components';
import { factsRepo, linksRepo } from '../../db/repositories';
import type { Fact, FactStatus } from '../../types';

type FilterType = 'all' | 'controvertido' | 'a_probar' | 'pacifico' | 'admitido';

const STATUS_LABELS: Record<FactStatus, string> = {
  pacifico: 'Pacífico',
  controvertido: 'Controvertido',
  admitido: 'Admitido',
  a_probar: 'A probar',
};

const STATUS_COLORS: Record<FactStatus, string> = {
  pacifico: 'var(--color-success)',
  controvertido: 'var(--color-danger)',
  admitido: 'var(--color-info)',
  a_probar: 'var(--color-warning)',
};

export function FactsPage() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [evidenceCounts, setEvidenceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadFacts();
  }, []);

  async function loadFacts() {
    try {
      const allFacts = await factsRepo.getAll();
      setFacts(allFacts);

      // Get evidence counts
      const counts: Record<string, number> = {};
      for (const fact of allFacts) {
        const evidence = await linksRepo.getEvidenceForFact(fact.id);
        counts[fact.id] = evidence.length;
      }
      setEvidenceCounts(counts);
    } catch (error) {
      console.error('Error loading facts:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredFacts = facts.filter((fact) => {
    if (filter === 'all') return true;
    return fact.status === filter;
  });

  const counts = {
    all: facts.length,
    controvertido: facts.filter((f) => f.status === 'controvertido').length,
    a_probar: facts.filter((f) => f.status === 'a_probar').length,
    pacifico: facts.filter((f) => f.status === 'pacifico').length,
    admitido: facts.filter((f) => f.status === 'admitido').length,
  };

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hechos</h1>
          <p className="page-subtitle">
            {counts.controvertido + counts.a_probar} hechos a probar
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="tabs mb-md">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({counts.all})
        </button>
        <button
          className={`tab ${filter === 'controvertido' ? 'active' : ''}`}
          onClick={() => setFilter('controvertido')}
        >
          Controvertidos ({counts.controvertido})
        </button>
        <button
          className={`tab ${filter === 'a_probar' ? 'active' : ''}`}
          onClick={() => setFilter('a_probar')}
        >
          A probar ({counts.a_probar})
        </button>
        <button
          className={`tab ${filter === 'pacifico' ? 'active' : ''}`}
          onClick={() => setFilter('pacifico')}
        >
          Pacíficos ({counts.pacifico})
        </button>
      </div>

      {filteredFacts.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Sin hechos"
          description={
            filter === 'all'
              ? 'Añade hechos para comenzar el análisis'
              : `No hay hechos con estado "${filter}"`
          }
          action={
            filter === 'all'
              ? {
                  label: 'Añadir hecho',
                  onClick: () => (window.location.href = '/facts/new'),
                }
              : undefined
          }
        />
      ) : (
        <div className="card">
          {filteredFacts.map((fact) => {
            const hasEvidence = evidenceCounts[fact.id] > 0;
            const needsEvidence =
              fact.status === 'controvertido' || fact.status === 'a_probar';

            return (
              <Link
                key={fact.id}
                to={`/facts/${fact.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  icon={
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: `${STATUS_COLORS[fact.status]}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        className="status-dot"
                        style={{ backgroundColor: STATUS_COLORS[fact.status] }}
                      />
                    </div>
                  }
                  title={fact.title}
                  subtitle={
                    <span>
                      {fact.id} · {STATUS_LABELS[fact.status]} · {fact.burden} ·{' '}
                      {evidenceCounts[fact.id] || 0} evidencias
                    </span>
                  }
                  action={
                    <div className="flex items-center gap-sm">
                      {needsEvidence && !hasEvidence && (
                        <span
                          className="chip chip-danger"
                          style={{ fontSize: '0.625rem' }}
                        >
                          Sin evidencia
                        </span>
                      )}
                      <span>›</span>
                    </div>
                  }
                />
              </Link>
            );
          })}
        </div>
      )}

      <Link to="/facts/new">
        <FAB icon="+" label="Nuevo hecho" onClick={() => {}} />
      </Link>
    </div>
  );
}
