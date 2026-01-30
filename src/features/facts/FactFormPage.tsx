// ============================================
// CASE OPS - Fact Form Page (Create/Edit)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { factsRepo, casesRepo, linksRepo } from '../../db/repositories';
import type { Fact, Case, FactStatus, Burden, RiskLevel } from '../../types';

export function FactFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasEvidence, setHasEvidence] = useState(false);

  const [formData, setFormData] = useState({
    caseId: '',
    title: '',
    narrative: '',
    status: 'a_probar' as FactStatus,
    burden: 'actora' as Burden,
    risk: 'medio' as RiskLevel,
    strength: 3,
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
        const fact = await factsRepo.getById(id);
        if (fact) {
          setFormData({
            caseId: fact.caseId,
            title: fact.title,
            narrative: fact.narrative,
            status: fact.status,
            burden: fact.burden,
            risk: fact.risk,
            strength: fact.strength,
            tags: fact.tags.join(', '),
          });

          // Check if has evidence
          const evidence = await linksRepo.getEvidenceForFact(id);
          setHasEvidence(evidence.length > 0);
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

    // Warn if controversial without evidence
    const needsEvidence =
      formData.status === 'controvertido' || formData.status === 'a_probar';
    if (needsEvidence && !hasEvidence && isEditing) {
      const proceed = confirm(
        `Este hecho tiene estado "${formData.status}" pero no tiene evidencias vinculadas. ¿Continuar de todos modos?`
      );
      if (!proceed) return;
    }

    setLoading(true);

    try {
      const factData = {
        caseId: formData.caseId,
        title: formData.title.trim(),
        narrative: formData.narrative.trim(),
        status: formData.status,
        burden: formData.burden,
        risk: formData.risk,
        strength: formData.strength,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await factsRepo.update(id!, factData);
      } else {
        await factsRepo.create(factData);
      }

      navigate('/facts');
    } catch (error) {
      console.error('Error saving fact:', error);
      alert('Error al guardar el hecho');
    } finally {
      setLoading(false);
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
          {isEditing ? 'Editar hecho' : 'Nuevo hecho'}
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
                placeholder="Ej: Pago hipoteca octubre 2020"
                required
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as FactStatus,
                  }))
                }
              >
                <option value="a_probar">A probar</option>
                <option value="controvertido">Controvertido</option>
                <option value="pacifico">Pacífico</option>
                <option value="admitido">Admitido</option>
              </select>
              <p className="form-hint">
                Hechos "controvertidos" o "a probar" requieren evidencia documental
              </p>
            </div>

            {/* Burden */}
            <div className="form-group">
              <label className="form-label">Carga de la prueba</label>
              <select
                className="form-select"
                value={formData.burden}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    burden: e.target.value as Burden,
                  }))
                }
              >
                <option value="actora">Actora</option>
                <option value="demandado">Demandado</option>
                <option value="mixta">Mixta</option>
              </select>
            </div>

            {/* Risk & Strength */}
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Riesgo</label>
                <select
                  className="form-select"
                  value={formData.risk}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      risk: e.target.value as RiskLevel,
                    }))
                  }
                >
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="bajo">Bajo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fuerza probatoria (1-5)</label>
                <select
                  className="form-select"
                  value={formData.strength}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      strength: parseInt(e.target.value, 10),
                    }))
                  }
                >
                  <option value={1}>1 - Muy débil</option>
                  <option value={2}>2 - Débil</option>
                  <option value={3}>3 - Media</option>
                  <option value={4}>4 - Fuerte</option>
                  <option value={5}>5 - Muy fuerte</option>
                </select>
              </div>
            </div>

            {/* Narrative */}
            <div className="form-group">
              <label className="form-label">Relato</label>
              <textarea
                className="form-textarea"
                value={formData.narrative}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, narrative: e.target.value }))
                }
                placeholder="Descripción detallada del hecho..."
                rows={6}
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
                placeholder="Separadas por comas: hipoteca, pago, 2020"
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
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear hecho'}
          </button>
        </div>
      </form>
    </div>
  );
}
