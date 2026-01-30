// ============================================
// CASE OPS - Document Detail Page
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ListItem, Chips, Modal } from '../../components';
import { documentsRepo, spansRepo, linksRepo, casesRepo } from '../../db/repositories';
import type { Document, Span, Link as LinkType, Case } from '../../types';
import { formatDate, formatDateTime } from '../../utils/dates';

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [spans, setSpans] = useState<Span[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
  }, [id]);

  async function loadDocument(docId: string) {
    try {
      const [doc, docSpans, docLinks] = await Promise.all([
        documentsRepo.getById(docId),
        spansRepo.getByDocumentId(docId),
        linksRepo.getByFrom('document', docId),
      ]);

      if (doc) {
        setDocument(doc);
        setSpans(docSpans);
        setLinks(docLinks);

        if (doc.caseId) {
          const caseInfo = await casesRepo.getById(doc.caseId);
          setCaseData(caseInfo || null);
        }
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!document) return;

    try {
      // Delete associated spans and links
      for (const span of spans) {
        await linksRepo.deleteByEntity('span', span.id);
        await spansRepo.delete(span.id);
      }
      await linksRepo.deleteByEntity('document', document.id);
      await documentsRepo.delete(document.id);

      navigate('/documents');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error al eliminar el documento');
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

  if (!document) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className="page-title">Documento no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '1.25rem' }}>
          {document.id}
        </h1>
        <Link to={`/documents/${document.id}/edit`} className="btn btn-ghost btn-icon">
          ✏️
        </Link>
      </div>

      {/* Main Info */}
      <div className="card mb-md">
        <div className="card-body">
          <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>{document.title}</h2>

          <div className="flex gap-sm mb-md">
            <span className="chip">{document.docType}</span>
            {document.annexCode && (
              <span className="chip chip-primary">{document.annexCode}</span>
            )}
            <span className="chip">{document.pagesCount} págs.</span>
          </div>

          {caseData && (
            <Link
              to={`/cases/${caseData.id}`}
              className="list-item"
              style={{
                margin: '0 calc(-1 * var(--spacing-md))',
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <span>⚖️</span>
              <div className="list-item-content">
                <div className="list-item-title">{caseData.title}</div>
                <div className="list-item-subtitle">{caseData.id}</div>
              </div>
              <span>›</span>
            </Link>
          )}

          <div className="mt-md">
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              <strong>Fuente:</strong> {document.source || 'No especificada'}
            </p>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              <strong>Fecha documento:</strong>{' '}
              {document.docDate ? formatDate(document.docDate) : 'No especificada'}
            </p>
          </div>

          {document.notes && (
            <div className="mt-md">
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                <strong>Notas:</strong>
              </p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{document.notes}</p>
            </div>
          )}

          {document.tags.length > 0 && (
            <div className="mt-md">
              <Chips items={document.tags} />
            </div>
          )}
        </div>
      </div>

      {/* View PDF Button */}
      <Link
        to={`/documents/${document.id}/view`}
        className="btn btn-primary btn-block btn-lg mb-lg"
      >
        📖 Ver PDF
      </Link>

      {/* Spans */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Spans ({spans.length})</h2>
          <Link
            to={`/documents/${document.id}/view`}
            className="btn btn-ghost btn-sm"
          >
            + Añadir
          </Link>
        </div>

        {spans.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-muted">
              <p>No hay spans marcados</p>
              <Link
                to={`/documents/${document.id}/view`}
                className="btn btn-secondary mt-md"
              >
                Abrir visor y crear spans
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            {spans.map((span) => (
              <Link
                key={span.id}
                to={`/documents/${document.id}/view?page=${span.pageStart}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  icon={<span style={{ fontSize: '1.25rem' }}>📑</span>}
                  title={span.label}
                  subtitle={`${span.id} · Págs. ${span.pageStart}-${span.pageEnd}`}
                  action="›"
                />
              </Link>
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
              <strong>Hash SHA-256:</strong>
              <br />
              <code className="font-mono" style={{ wordBreak: 'break-all' }}>
                {document.hashSha256}
              </code>
            </p>
            <p className="text-muted mt-sm" style={{ fontSize: '0.75rem' }}>
              <strong>Creado:</strong> {formatDateTime(document.createdAt)}
            </p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              <strong>Actualizado:</strong> {formatDateTime(document.updatedAt)}
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
          Eliminar documento
        </button>
      </section>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar documento"
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
          ¿Estás seguro de que quieres eliminar el documento{' '}
          <strong>{document.title}</strong>?
        </p>
        <p className="mt-md text-warning">
          Se eliminarán también {spans.length} spans asociados y sus enlaces.
        </p>
        <p className="mt-sm text-muted" style={{ fontSize: '0.875rem' }}>
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
