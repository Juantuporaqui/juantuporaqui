// ============================================
// CASE OPS - Event Form Page (Create/Edit)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsRepo, casesRepo } from '../../db/repositories';
import { getCurrentDate } from '../../utils/dates';
import type { Case, EventType } from '../../types';

export function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    caseId: '',
    date: getCurrentDate(),
    type: 'procesal' as EventType,
    title: '',
    description: '',
    tags: '',
  });

  useEffect(() => {
    loadInitialData();
  }, [id]);

  async function loadInitialData() {
    setLoading(true);
    try {
      const allCases = await casesRepo.getAll();
      setCases(allCases);

      if (allCases.length === 1) {
        setFormData((prev) => ({ ...prev, caseId: allCases[0].id }));
      }

      if (id) {
        const event = await eventsRepo.getById(id);
        if (event) {
          setFormData({
            caseId: event.caseId,
            date: event.date,
            type: event.type,
            title: event.title,
            description: event.description,
            tags: event.tags.join(', '),
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.caseId) {
      alert('Selecciona un caso');
      return;
    }

    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        caseId: formData.caseId,
        date: formData.date,
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await eventsRepo.update(id!, eventData);
      } else {
        await eventsRepo.create(eventData);
      }

      navigate('/events');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error al guardar el evento');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este evento?')) return;

    try {
      await eventsRepo.delete(id!);
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }

  if (loading && isEditing) {
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
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1 }}>
          {isEditing ? 'Editar evento' : 'Nuevo evento'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            {/* Case */}
            <div className="form-group">
              <label className="form-label">Caso *</label>
              <select
                className="form-select"
                value={formData.caseId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, caseId: e.target.value }))
                }
                required
              >
                <option value="">Seleccionar caso...</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                required
              />
            </div>

            {/* Type */}
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <div className="flex gap-sm">
                <button
                  type="button"
                  className={`btn ${
                    formData.type === 'procesal' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: 'procesal' }))
                  }
                >
                  ⚖️ Procesal
                </button>
                <button
                  type="button"
                  className={`btn ${
                    formData.type === 'factico' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: 'factico' }))
                  }
                >
                  📅 Fáctico
                </button>
              </div>
              <p className="form-hint">
                Procesal: audiencias, resoluciones, plazos. Fáctico: hechos del caso.
              </p>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ej: Audiencia previa, Firma escritura..."
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Detalles del evento..."
                rows={4}
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <input
                type="text"
                className="form-input"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Separadas por comas"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-lg">
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear evento'}
          </button>
        </div>

        {isEditing && (
          <button
            type="button"
            className="btn btn-danger btn-block mt-md"
            onClick={handleDelete}
          >
            Eliminar evento
          </button>
        )}
      </form>
    </div>
  );
}
