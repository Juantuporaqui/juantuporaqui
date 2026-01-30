// ============================================
// CASE OPS - Events (Timeline) Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAB, EmptyState } from '../../components';
import { eventsRepo } from '../../db/repositories';
import type { Event } from '../../types';
import { formatDate } from '../../utils/dates';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'procesal' | 'factico'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const allEvents = await eventsRepo.getAll();
      // Sort by date ascending for timeline
      setEvents(allEvents.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.type === filter;
  });

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
          <h1 className="page-title">Cronología</h1>
          <p className="page-subtitle">{events.length} eventos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="tabs mb-md">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({events.length})
        </button>
        <button
          className={`tab ${filter === 'procesal' ? 'active' : ''}`}
          onClick={() => setFilter('procesal')}
        >
          Procesales ({events.filter((e) => e.type === 'procesal').length})
        </button>
        <button
          className={`tab ${filter === 'factico' ? 'active' : ''}`}
          onClick={() => setFilter('factico')}
        >
          Fácticos ({events.filter((e) => e.type === 'factico').length})
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Sin eventos"
          description="Añade eventos a la cronología"
          action={{
            label: 'Añadir evento',
            onClick: () => (window.location.href = '/events/new'),
          }}
        />
      ) : (
        <div className="timeline">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-marker">
                <span>{event.type === 'procesal' ? '⚖️' : '📅'}</span>
              </div>
              <div className="timeline-content">
                <Link
                  to={`/events/${event.id}/edit`}
                  className="card"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div className="card-body">
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {formatDate(event.date)}
                    </div>
                    <h3
                      style={{
                        marginTop: 'var(--spacing-xs)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      {event.title}
                    </h3>
                    {event.description && (
                      <p
                        className="text-muted"
                        style={{
                          fontSize: '0.875rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {event.description}
                      </p>
                    )}
                    <div className="flex gap-sm mt-sm">
                      <span
                        className={`chip ${
                          event.type === 'procesal' ? 'chip-primary' : ''
                        }`}
                      >
                        {event.type === 'procesal' ? 'Procesal' : 'Fáctico'}
                      </span>
                      {event.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .timeline {
          position: relative;
          padding-left: 40px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--border-color);
        }

        .timeline-item {
          position: relative;
          margin-bottom: var(--spacing-md);
        }

        .timeline-marker {
          position: absolute;
          left: -40px;
          width: 32px;
          height: 32px;
          background-color: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }

        .timeline-content {
          padding-left: var(--spacing-sm);
        }
      `}</style>

      <Link to="/events/new">
        <FAB icon="+" label="Nuevo evento" onClick={() => {}} />
      </Link>
    </div>
  );
}
