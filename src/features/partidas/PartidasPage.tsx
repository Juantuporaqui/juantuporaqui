// ============================================
// CASE OPS - Partidas (Economic Items) List Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAB, EmptyState, ListItem } from '../../components';
import { partidasRepo, linksRepo } from '../../db/repositories';
import type { Partida, PartidaState } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

type FilterType = 'all' | 'reclamable' | 'discutida' | 'neutral' | 'prescrita_interna';

const STATE_LABELS: Record<PartidaState, string> = {
  reclamable: 'Reclamable',
  discutida: 'Discutida',
  prescrita_interna: 'Prescrita (interna)',
  neutral: 'Neutral',
};

const STATE_COLORS: Record<PartidaState, string> = {
  reclamable: 'var(--color-success)',
  discutida: 'var(--color-danger)',
  prescrita_interna: 'var(--text-muted)',
  neutral: 'var(--color-info)',
};

export function PartidasPage() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [evidenceCounts, setEvidenceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadPartidas();
  }, []);

  async function loadPartidas() {
    try {
      const allPartidas = await partidasRepo.getAll();
      setPartidas(allPartidas);

      // Get evidence counts
      const counts: Record<string, number> = {};
      for (const partida of allPartidas) {
        const evidence = await linksRepo.getEvidenceForPartida(partida.id);
        counts[partida.id] = evidence.length;
      }
      setEvidenceCounts(counts);
    } catch (error) {
      console.error('Error loading partidas:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPartidas = partidas.filter((p) => {
    if (filter === 'all') return true;
    return p.state === filter;
  });

  const counts = {
    all: partidas.length,
    reclamable: partidas.filter((p) => p.state === 'reclamable').length,
    discutida: partidas.filter((p) => p.state === 'discutida').length,
    neutral: partidas.filter((p) => p.state === 'neutral').length,
    prescrita_interna: partidas.filter((p) => p.state === 'prescrita_interna').length,
  };

  const totalAmount = filteredPartidas.reduce((sum, p) => sum + p.amountCents, 0);

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
          <h1 className="page-title">Partidas</h1>
          <p className="page-subtitle">
            Total: {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="tabs mb-md">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({counts.all})
        </button>
        <button
          className={`tab ${filter === 'reclamable' ? 'active' : ''}`}
          onClick={() => setFilter('reclamable')}
        >
          Reclamables ({counts.reclamable})
        </button>
        <button
          className={`tab ${filter === 'discutida' ? 'active' : ''}`}
          onClick={() => setFilter('discutida')}
        >
          Discutidas ({counts.discutida})
        </button>
        <button
          className={`tab ${filter === 'neutral' ? 'active' : ''}`}
          onClick={() => setFilter('neutral')}
        >
          Neutras ({counts.neutral})
        </button>
      </div>

      {filteredPartidas.length === 0 ? (
        <EmptyState
          icon="💰"
          title="Sin partidas"
          description={
            filter === 'all'
              ? 'Añade partidas económicas para el análisis'
              : `No hay partidas con estado "${filter}"`
          }
          action={
            filter === 'all'
              ? {
                  label: 'Añadir partida',
                  onClick: () => (window.location.href = '/partidas/new'),
                }
              : undefined
          }
        />
      ) : (
        <div className="card">
          {filteredPartidas.map((partida) => {
            const hasEvidence = evidenceCounts[partida.id] > 0;
            const needsEvidence = partida.state === 'discutida';

            return (
              <Link
                key={partida.id}
                to={`/partidas/${partida.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  icon={
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: `${STATE_COLORS[partida.state]}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                      }}
                    >
                      💰
                    </div>
                  }
                  title={
                    <span>
                      <span style={{ fontWeight: 700 }}>
                        {formatCurrency(partida.amountCents)}
                      </span>
                      <span className="text-muted" style={{ marginLeft: 8 }}>
                        {partida.concept}
                      </span>
                    </span>
                  }
                  subtitle={
                    <span>
                      {partida.id} · {formatDate(partida.date)} ·{' '}
                      {STATE_LABELS[partida.state]} · {evidenceCounts[partida.id] || 0}{' '}
                      evidencias
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

      {/* Summary */}
      <div className="card mt-lg">
        <div className="card-body">
          <h3 className="section-title mb-md">Resumen económico</h3>
          <div className="grid grid-2">
            <div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                Reclamables
              </p>
              <p className="font-bold text-success">
                {formatCurrency(
                  partidas
                    .filter((p) => p.state === 'reclamable')
                    .reduce((sum, p) => sum + p.amountCents, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                Discutidas
              </p>
              <p className="font-bold text-danger">
                {formatCurrency(
                  partidas
                    .filter((p) => p.state === 'discutida')
                    .reduce((sum, p) => sum + p.amountCents, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Link to="/partidas/new">
        <FAB icon="+" label="Nueva partida" onClick={() => {}} />
      </Link>
    </div>
  );
}
