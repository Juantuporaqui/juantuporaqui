// ============================================
// CASE OPS - New Task Page
// ============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tasksRepo } from '../../db/repositories';
import type { TaskPriority } from '../../types';

export function NewTaskPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('media');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    setLoading(true);

    try {
      await tasksRepo.create({
        caseId: '', // Sin caso asociado por defecto
        title: title.trim(),
        dueDate: dueDate || undefined,
        priority,
        status: 'pendiente',
        notes: '',
        links: [],
      });

      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <span>←</span>
          <span>Volver a Tareas</span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-100">Nueva Tarea</h1>
        <p className="text-sm text-slate-400 mt-1">
          Crea una nueva acción para el War Room
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Título */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-300"
          >
            Título *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Revisar escritura de compraventa"
            required
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Fecha de Vencimiento */}
        <div className="space-y-2">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-slate-300"
          >
            Fecha de Vencimiento
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors [color-scheme:dark]"
          />
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-slate-300"
          >
            Prioridad
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Creando...' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </div>
  );
}
