// ============================================
// CASE OPS - Partida Detail Page
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ListItem, Chips, Modal } from '../../components';
import { partidasRepo, linksRepo, spansRepo, documentsRepo } from '../../db/repositories';
import type { Partida, Span, Document, Link as LinkType } from '../../types';
import { formatDate, formatDateTime } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

const STATE_LABELS = {
  reclamable: 'Reclamable',
  discutida: 'Discutida',
  prescrita_interna: 'Prescrita (interna)',
  neutral: 'Neutral',
};

export function PartidaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partida, setPartida] = useState<Partida | null>(null);
  const [evidence, setEvidence] = useState<
    { link: LinkType; span: Span; document: Document }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadPartida(id);
    }
  }, [id]);

  async function loadPartida(partidaId: string) {
    try {
      const partidaData = await partidasRepo.getById(partidaId);
      if (!partidaData) {
        navigate('/partidas');
        return;
      }

      setPartida(partidaData);

      // Load evidence
      const evidenceLinks = await linksRepo.getEvidenceForPartida(partidaId);
      const evidenceData = [];

      for (const link of evidenceLinks) {
        const span = await spansRepo.getById(link.fromId);
        if (span) {
          const doc = await documentsRepo.getById(span.documentId);
          if (doc) {
            evidenceData.push({ link, span, document: doc });
          }
        }
      }

      setEvidence(evidenceData);
    } catch (error) {
      console.error('Error loading partida:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!partida) return;

    try {
      await linksRepo.deleteByEntity('partida', partida.id);
      await partidasRepo.delete(partida.id);
      navigate('/partidas');
    } catch (error) {
      console.error('Error deleting partida:', error);
      alert('Error al eliminar la partida');
    }
  }

  async function handleRemoveEvidence(linkId: string) {
    try {
      await linksRepo.delete(linkId);
      setEvidence(evidence.filter((e) => e.link.id !== linkId));
    } catch (error) {
      console.error('Error removing evidence:', error);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!partida) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className="page-title">Partida no encontrada</h1>
        </div>
      </div>
    );
  }

  const needsEvidence = partida.state === 'discutida';
  const hasEvidence = evidence.length > 0;

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '1.25rem' }}>
          {partida.id}
        </h1>
        <Link to={`/partidas/${partida.id}/edit`} className="btn btn-ghost btn-icon">
          ✏️
        </Link>
      </div>

      {/* Warning if no evidence */}
      {needsEvidence && !hasEvidence && (
        <div className="alert alert-warning mb-md">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <div className="alert-title">Sin evidencia</div>
            <div className="alert-description">
              Esta partida discutida no tiene evidencia documental vinculada
            </div>
          </div>
        </div>
      )}

      {/* Main Info */}
      <div className="card mb-md">
        <div className="card-body">
          <div
            className="stat-value"
            style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}
          >
            {formatCurrency(partida.amountCents)}
          </div>

          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{partida.concept}</h2>

          <div className="flex flex-wrap gap-sm mb-md">
            <span
              className={`chip ${
                partida.state === 'reclamable'
                  ? 'chip-success'
                  : partida.state === 'discutida'
                  ? 'chip-danger'
                  : ''
              }`}
            >
              {STATE_LABELS[partida.state]}
            </span>
            <span className="chip">{formatDate(partida.date)}</span>
            <span className="chip">{partida.currency}</span>
          </div>

          {/* Transfer details */}
          <div
            className="mt-md"
            style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius-sm)',
            }}
          >
            {partida.payer && (
              <p style={{ fontSize: '0.875rem' }}>
                <strong>Pagador:</strong> {partida.payer}
              </p>
            )}
            {partida.beneficiary && (
              <p style={{ fontSize: '0.875rem' }}>
                <strong>Beneficiario:</strong> {partida.beneficiary}
              </p>
            )}
            {partida.accountFrom && (
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                <strong>Cuenta origen:</strong> {partida.accountFrom}
              </p>
            )}
            {partida.accountTo && (
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                <strong>Cuenta destino:</strong> {partida.accountTo}
              </p>
            )}
          </div>

          {partida.theory && (
            <div className="mt-md">
              <p
                className="text-muted"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Teoría/Justificación:
              </p>
              <p style={{ marginTop: 'var(--spacing-xs)' }}>{partida.theory}</p>
            </div>
          )}

          {partida.notes && (
            <div className="mt-md">
              <p
                className="text-muted"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Notas:
              </p>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: 'var(--spacing-xs)' }}>
                {partida.notes}
              </p>
            </div>
          )}

          {partida.tags.length > 0 && (
            <div className="mt-md">
              <Chips items={partida.tags} />
            </div>
          )}
        </div>
      </div>

      {/* Evidence */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Evidencias ({evidence.length})</h2>
        </div>

        {evidence.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-muted">
              <p>No hay evidencias vinculadas</p>
              <p className="mt-sm" style={{ fontSize: '0.875rem' }}>
                Ve a un documento, crea un span y enlázalo a esta partida
              </p>
              <Link to="/documents" className="btn btn-secondary mt-md">
                Ir a documentos
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            {evidence.map(({ link, span, document }) => (
              <div key={link.id} className="list-item">
                <span style={{ fontSize: '1.5rem' }}>📑</span>
                <Link
                  to={`/documents/${document.id}/view?page=${span.pageStart}`}
                  className="list-item-content"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="list-item-title">{span.label}</div>
                  <div className="list-item-subtitle">
                    {document.title} · Págs. {span.pageStart}-{span.pageEnd}
                  </div>
                </Link>
                <button
                  className="btn btn-ghost btn-icon-sm"
                  onClick={() => handleRemoveEvidence(link.id)}
                  title="Quitar evidencia"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Metadata */}
      <section className="section">
        <h2 className="section-title">Metadatos</h2>
        <div className="card">
          <div className="card-body">
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              <strong>Caso:</strong> {partida.caseId}
            </p>
            <p className="text-muted mt-sm" style={{ fontSize: '0.75rem' }}>
              <strong>Creado:</strong> {formatDateTime(partida.createdAt)}
            </p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              <strong>Actualizado:</strong> {formatDateTime(partida.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      {/* Delete */}
      <section className="section">
        <button
          className="btn btn-danger btn-block"
          onClick={() => setShowDeleteModal(true)}
        >
          Eliminar partida
        </button>
      </section>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar partida"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          </>
        }
      >
        <p>
          ¿Estás seguro de que quieres eliminar la partida{' '}
          <strong>
            {partida.concept} ({formatCurrency(partida.amountCents)})
          </strong>
          ?
        </p>
        <p className="mt-sm text-muted" style={{ fontSize: '0.875rem' }}>
          Se eliminarán también los enlaces de evidencia.
        </p>
      </Modal>
    </div>
  );
}
