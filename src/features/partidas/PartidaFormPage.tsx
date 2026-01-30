// ============================================
// CASE OPS - Partida Form Page (Create/Edit)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { partidasRepo, casesRepo } from '../../db/repositories';
import { parseCurrencyInput, eurosToCents, centsToEuros } from '../../utils/validators';
import { getCurrentDate } from '../../utils/dates';
import type { Case, PartidaState } from '../../types';

export function PartidaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    caseId: '',
    date: getCurrentDate(),
    amount: '',
    currency: 'EUR',
    concept: '',
    accountFrom: '',
    accountTo: '',
    payer: '',
    beneficiary: '',
    theory: '',
    state: 'reclamable' as PartidaState,
    tags: '',
    notes: '',
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
        const partida = await partidasRepo.getById(id);
        if (partida) {
          setFormData({
            caseId: partida.caseId,
            date: partida.date,
            amount: centsToEuros(partida.amountCents),
            currency: partida.currency,
            concept: partida.concept,
            accountFrom: partida.accountFrom || '',
            accountTo: partida.accountTo || '',
            payer: partida.payer || '',
            beneficiary: partida.beneficiary || '',
            theory: partida.theory || '',
            state: partida.state,
            tags: partida.tags.join(', '),
            notes: partida.notes,
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

    if (!formData.concept.trim()) {
      alert('El concepto es obligatorio');
      return;
    }

    const amountCents = parseCurrencyInput(formData.amount);
    if (amountCents === null || amountCents < 0) {
      alert('El importe no es válido');
      return;
    }

    if (!formData.date) {
      alert('La fecha es obligatoria');
      return;
    }

    setLoading(true);

    try {
      const partidaData = {
        caseId: formData.caseId,
        date: formData.date,
        amountCents,
        currency: formData.currency,
        concept: formData.concept.trim(),
        accountFrom: formData.accountFrom.trim() || undefined,
        accountTo: formData.accountTo.trim() || undefined,
        payer: formData.payer.trim() || undefined,
        beneficiary: formData.beneficiary.trim() || undefined,
        theory: formData.theory.trim() || undefined,
        state: formData.state,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        notes: formData.notes.trim(),
      };

      if (isEditing) {
        await partidasRepo.update(id!, partidaData);
      } else {
        await partidasRepo.create(partidaData);
      }

      navigate('/partidas');
    } catch (error) {
      console.error('Error saving partida:', error);
      alert('Error al guardar la partida');
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
          {isEditing ? 'Editar partida' : 'Nueva partida'}
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

            {/* Amount & Currency */}
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Importe *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="1.234,56"
                  inputMode="decimal"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Moneda</label>
                <select
                  className="form-select"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, currency: e.target.value }))
                  }
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
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

            {/* Concept */}
            <div className="form-group">
              <label className="form-label">Concepto *</label>
              <input
                type="text"
                className="form-input"
                value={formData.concept}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, concept: e.target.value }))
                }
                placeholder="Ej: Cuota hipoteca octubre 2020"
                required
              />
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    state: e.target.value as PartidaState,
                  }))
                }
              >
                <option value="reclamable">Reclamable</option>
                <option value="discutida">Discutida</option>
                <option value="neutral">Neutral</option>
                <option value="prescrita_interna">Prescrita (interna)</option>
              </select>
              <p className="form-hint">
                Las partidas "discutidas" requieren evidencia documental
              </p>
            </div>

            {/* Payer & Beneficiary */}
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Pagador</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.payer}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, payer: e.target.value }))
                  }
                  placeholder="Nombre del pagador"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Beneficiario</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.beneficiary}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, beneficiary: e.target.value }))
                  }
                  placeholder="Nombre del beneficiario"
                />
              </div>
            </div>

            {/* Accounts */}
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Cuenta origen</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.accountFrom}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, accountFrom: e.target.value }))
                  }
                  placeholder="IBAN o referencia"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cuenta destino</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.accountTo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, accountTo: e.target.value }))
                  }
                  placeholder="IBAN o referencia"
                />
              </div>
            </div>

            {/* Theory */}
            <div className="form-group">
              <label className="form-label">Teoría/Justificación</label>
              <textarea
                className="form-textarea"
                value={formData.theory}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, theory: e.target.value }))
                }
                placeholder="Razón legal o argumento para reclamar..."
                rows={3}
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
                placeholder="Separadas por comas: hipoteca, 2020, chalet"
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Observaciones adicionales..."
                rows={3}
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
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear partida'}
          </button>
        </div>
      </form>
    </div>
  );
}
