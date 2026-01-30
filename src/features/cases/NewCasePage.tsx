// ============================================
// CASE OPS - New Case Page
// Formulario para dar de alta un nuevo procedimiento
// ============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { casesRepo } from '../../db/repositories';
import type { CaseStatus, CaseType } from '../../types';

const CASE_TYPES: { value: CaseType; label: string }[] = [
  { value: 'ordinario', label: 'Ordinario' },
  { value: 'ejecucion', label: 'Ejecución' },
  { value: 'incidente', label: 'Incidente' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'mediacion', label: 'Mediación' },
  { value: 'potencial', label: 'Potencial' },
];

const CASE_STATUSES: { value: CaseStatus; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'suspendido', label: 'Suspendido' },
  { value: 'archivado', label: 'Archivado' },
  { value: 'cerrado', label: 'Cerrado' },
];

export function NewCasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [autosNumber, setAutosNumber] = useState('');
  const [court, setCourt] = useState('');
  const [type, setType] = useState<CaseType>('ordinario');
  const [status, setStatus] = useState<CaseStatus>('activo');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert('El título del procedimiento es obligatorio');
      return;
    }

    setLoading(true);

    try {
      // Parse tags from comma-separated input
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      const newCase = await casesRepo.create({
        title: title.trim(),
        autosNumber: autosNumber.trim(),
        court: court.trim(),
        type,
        status,
        tags,
        notes: notes.trim(),
      });

      // Navigate to the new case detail
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Error al crear el procedimiento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors"
        >
          <span>←</span>
          <span>Volver a Procedimientos</span>
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-2xl">
            ⚖️
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              War Room
            </p>
            <h1 className="text-2xl font-bold text-slate-100">
              Nuevo Procedimiento
            </h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Da de alta un nuevo expediente judicial en el sistema
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Título */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-300"
          >
            Título del Procedimiento *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Procedimiento Ordinario Civil"
            required
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Grid: Autos + Juzgado */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Número de Autos */}
          <div className="space-y-2">
            <label
              htmlFor="autosNumber"
              className="block text-sm font-medium text-slate-300"
            >
              Referencia (Autos)
            </label>
            <input
              id="autosNumber"
              type="text"
              value={autosNumber}
              onChange={(e) => setAutosNumber(e.target.value)}
              placeholder="Ej: 715/2024"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Juzgado */}
          <div className="space-y-2">
            <label
              htmlFor="court"
              className="block text-sm font-medium text-slate-300"
            >
              Juzgado
            </label>
            <input
              id="court"
              type="text"
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              placeholder="Ej: JPII nº 1 de Picassent"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Grid: Tipo + Estado */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Tipo de Procedimiento */}
          <div className="space-y-2">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-slate-300"
            >
              Tipo de Procedimiento
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as CaseType)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors appearance-none cursor-pointer"
            >
              {CASE_TYPES.map((caseType) => (
                <option key={caseType.value} value={caseType.value}>
                  {caseType.label}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-300"
            >
              Estado
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors appearance-none cursor-pointer"
            >
              {CASE_STATUSES.map((caseStatus) => (
                <option key={caseStatus.value} value={caseStatus.value}>
                  {caseStatus.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Etiquetas */}
        <div className="space-y-2">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-slate-300"
          >
            Etiquetas
          </label>
          <input
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Ej: hipoteca, división, urgente (separadas por comas)"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
          <p className="text-xs text-slate-500">
            Separa las etiquetas con comas
          </p>
        </div>

        {/* Notas */}
        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-slate-300"
          >
            Notas del Expediente
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descripción general, partes involucradas, objeto del litigio..."
            rows={5}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-4 text-base font-semibold text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-amber-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-amber-500/20 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creando...
              </span>
            ) : (
              'Crear Procedimiento'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
