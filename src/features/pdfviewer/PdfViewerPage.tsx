// ============================================
// CASE OPS - PDF Viewer with Spans
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../../components';
import {
  documentsRepo,
  docFilesRepo,
  spansRepo,
  linksRepo,
  factsRepo,
  partidasRepo,
} from '../../db/repositories';
import type { Document, DocFile, Span, Fact, Partida } from '../../types';
import * as pdfjsLib from 'pdfjs-dist';
import './PdfViewer.css';

export function PdfViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Document state
  const [document, setDocument] = useState<Document | null>(null);
  const [docFile, setDocFile] = useState<DocFile | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);

  // Spans state
  const [spans, setSpans] = useState<Span[]>([]);
  const [showSpanModal, setShowSpanModal] = useState(false);
  const [spanForm, setSpanForm] = useState({
    pageStart: 1,
    pageEnd: 1,
    label: '',
    note: '',
    tags: '',
  });

  // Link modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedSpan, setSelectedSpan] = useState<Span | null>(null);
  const [linkType, setLinkType] = useState<'fact' | 'partida'>('fact');
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [selectedLinkTarget, setSelectedLinkTarget] = useState('');

  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
  }, [id]);

  useEffect(() => {
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    if (initialPage > 0 && initialPage <= totalPages) {
      setCurrentPage(initialPage);
    }
  }, [searchParams, totalPages]);

  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale]);

  async function loadDocument(docId: string) {
    try {
      const doc = await documentsRepo.getById(docId);
      if (!doc) {
        navigate('/documents');
        return;
      }

      setDocument(doc);

      // Load PDF file
      const file = await docFilesRepo.getById(doc.fileId);
      if (!file) {
        alert('Archivo PDF no encontrado');
        navigate(`/documents/${docId}`);
        return;
      }

      setDocFile(file);

      // Load spans
      const docSpans = await spansRepo.getByDocumentId(docId);
      setSpans(docSpans);

      // Load PDF
      const arrayBuffer = await file.blob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);

      // Load facts and partidas for linking
      if (doc.caseId) {
        const [caseFacts, casePartidas] = await Promise.all([
          factsRepo.getByCaseId(doc.caseId),
          partidasRepo.getByCaseId(doc.caseId),
        ]);
        setFacts(caseFacts);
        setPartidas(casePartidas);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      alert('Error al cargar el documento');
    } finally {
      setLoading(false);
    }
  }

  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current || rendering) return;

      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
          canvas,
        }).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      } finally {
        setRendering(false);
      }
    },
    [pdfDoc, scale, rendering]
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  function handleCreateSpan() {
    setSpanForm({
      pageStart: currentPage,
      pageEnd: currentPage,
      label: '',
      note: '',
      tags: '',
    });
    setShowSpanModal(true);
  }

  async function handleSaveSpan() {
    if (!document || !spanForm.label.trim()) {
      alert('El label es obligatorio');
      return;
    }

    try {
      const span = await spansRepo.create({
        documentId: document.id,
        caseId: document.caseId,
        pageStart: spanForm.pageStart,
        pageEnd: spanForm.pageEnd,
        label: spanForm.label.trim(),
        note: spanForm.note.trim(),
        tags: spanForm.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });

      setSpans([...spans, span]);
      setShowSpanModal(false);
    } catch (error) {
      console.error('Error creating span:', error);
      alert('Error al crear el span');
    }
  }

  function handleLinkSpan(span: Span) {
    setSelectedSpan(span);
    setSelectedLinkTarget('');
    setShowLinkModal(true);
  }

  async function handleCreateLink() {
    if (!selectedSpan || !selectedLinkTarget) {
      alert('Selecciona un destino');
      return;
    }

    try {
      await linksRepo.create(
        'span',
        selectedSpan.id,
        linkType,
        selectedLinkTarget,
        'evidence',
        `Enlazado desde visor PDF`
      );

      alert(`Enlace creado correctamente`);
      setShowLinkModal(false);
    } catch (error) {
      console.error('Error creating link:', error);
      alert('Error al crear el enlace');
    }
  }

  async function handleDeleteSpan(span: Span) {
    if (!confirm(`¿Eliminar span "${span.label}"?`)) return;

    try {
      await linksRepo.deleteByEntity('span', span.id);
      await spansRepo.delete(span.id);
      setSpans(spans.filter((s) => s.id !== span.id));
    } catch (error) {
      console.error('Error deleting span:', error);
      alert('Error al eliminar el span');
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center items-center" style={{ height: '50vh' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!document || !pdfDoc) {
    return (
      <div className="page">
        <p>Documento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      {/* Header */}
      <div className="pdf-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="pdf-title">
          <span className="truncate">{document.title}</span>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            {document.id}
          </span>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleCreateSpan}
        >
          + Span
        </button>
      </div>

      {/* Canvas */}
      <div className="pdf-canvas-container">
        {rendering && (
          <div className="pdf-loading">
            <div className="spinner" />
          </div>
        )}
        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>

      {/* Navigation */}
      <div className="pdf-nav">
        <button
          className="btn btn-secondary btn-icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          ‹
        </button>

        <div className="pdf-page-info">
          <input
            type="number"
            className="pdf-page-input"
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value, 10))}
            min={1}
            max={totalPages}
          />
          <span>/ {totalPages}</span>
        </div>

        <button
          className="btn btn-secondary btn-icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          ›
        </button>

        <div className="pdf-zoom">
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
          >
            −
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={() => setScale(Math.min(3, scale + 0.25))}
          >
            +
          </button>
        </div>
      </div>

      {/* Spans Panel */}
      <div className="pdf-spans">
        <h3 className="section-title">Spans ({spans.length})</h3>
        {spans.length === 0 ? (
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            No hay spans. Pulsa "+ Span" para crear uno.
          </p>
        ) : (
          <div className="spans-list">
            {spans.map((span) => (
              <div
                key={span.id}
                className={`span-item ${
                  currentPage >= span.pageStart && currentPage <= span.pageEnd
                    ? 'span-item-active'
                    : ''
                }`}
              >
                <div
                  className="span-item-content"
                  onClick={() => goToPage(span.pageStart)}
                >
                  <div className="span-item-label">{span.label}</div>
                  <div className="span-item-pages">
                    {span.id} · Págs. {span.pageStart}-{span.pageEnd}
                  </div>
                </div>
                <div className="span-item-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleLinkSpan(span)}
                    title="Enlazar a hecho/partida"
                  >
                    🔗
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDeleteSpan(span)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Span Modal */}
      <Modal
        isOpen={showSpanModal}
        onClose={() => setShowSpanModal(false)}
        title="Crear Span"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSpanModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSaveSpan}>
              Guardar
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Etiqueta *</label>
          <input
            type="text"
            className="form-input"
            value={spanForm.label}
            onChange={(e) =>
              setSpanForm((prev) => ({ ...prev, label: e.target.value }))
            }
            placeholder="Ej: Firma del contrato, Cláusula 5..."
            autoFocus
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Página inicio</label>
            <input
              type="number"
              className="form-input"
              value={spanForm.pageStart}
              onChange={(e) =>
                setSpanForm((prev) => ({
                  ...prev,
                  pageStart: parseInt(e.target.value, 10) || 1,
                }))
              }
              min={1}
              max={totalPages}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Página fin</label>
            <input
              type="number"
              className="form-input"
              value={spanForm.pageEnd}
              onChange={(e) =>
                setSpanForm((prev) => ({
                  ...prev,
                  pageEnd: parseInt(e.target.value, 10) || 1,
                }))
              }
              min={spanForm.pageStart}
              max={totalPages}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nota</label>
          <textarea
            className="form-textarea"
            value={spanForm.note}
            onChange={(e) =>
              setSpanForm((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="Descripción o contexto..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            type="text"
            className="form-input"
            value={spanForm.tags}
            onChange={(e) =>
              setSpanForm((prev) => ({ ...prev, tags: e.target.value }))
            }
            placeholder="Separados por comas"
          />
        </div>
      </Modal>

      {/* Link Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title={`Enlazar span: ${selectedSpan?.label}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowLinkModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleCreateLink}>
              Crear enlace
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Enlazar a</label>
          <div className="flex gap-sm mb-md">
            <button
              className={`btn ${linkType === 'fact' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setLinkType('fact');
                setSelectedLinkTarget('');
              }}
            >
              📋 Hecho
            </button>
            <button
              className={`btn ${linkType === 'partida' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setLinkType('partida');
                setSelectedLinkTarget('');
              }}
            >
              💰 Partida
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Seleccionar {linkType === 'fact' ? 'hecho' : 'partida'}
          </label>
          <select
            className="form-select"
            value={selectedLinkTarget}
            onChange={(e) => setSelectedLinkTarget(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {linkType === 'fact'
              ? facts.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} - {f.title}
                  </option>
                ))
              : partidas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.concept}
                  </option>
                ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
