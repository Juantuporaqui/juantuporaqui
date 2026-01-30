import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { strategiesRepo } from '../../db/repositories';
import { nanoid } from 'nanoid';
import Card from '../../ui/components/Card';

export function NewStrategyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    attack: '',
    rebuttal: '',
    risk: 'medio' as 'alto' | 'medio' | 'bajo',
    status: 'draft' as 'active' | 'draft' | 'discarded',
    tags: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await strategiesRepo.create({
        id: nanoid(),
        caseId: '', // General por defecto
        attack: formData.attack,
        rebuttal: formData.rebuttal,
        risk: formData.risk,
        status: formData.status,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: Date.now(),
      });
      navigate('/warroom');
    } catch (error) {
      console.error('Error creating strategy:', error);
      alert('Error al guardar la estrategia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* CABECERA */}
      <header>
        <Link 
          to="/warroom" 
          className="mb-4 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400"
        >
          ← Cancelar y Volver
        </Link>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Nueva Línea de Defensa
        </h1>
        <p className="text-sm text-slate-400">
          Define un posible ataque contrario y nuestra respuesta.
        </p>
      </header>

      {/* FORMULARIO */}
      <Card className="p-0 overflow-hidden bg-slate-900/50 border-slate-800">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* SECCIÓN 1: EL ATAQUE */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-500">
              Tesis Contraria (Ataque)
            </label>
            <textarea
              required
              rows={3}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-slate-100 placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
              placeholder="Ej: Alegarán que la transferencia de 2024 es un error subsanable..."
              value={formData.attack}
              onChange={e => setFormData({...formData, attack: e.target.value})}
            />
          </div>

          {/* SECCIÓN 2: NUESTRA DEFENSA */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-500">
              Nuestra Respuesta (Defensa)
            </label>
            <textarea
              required
              rows={4}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
              placeholder="Ej: Invocaremos la doctrina de los actos propios y la imposibilidad material..."
              value={formData.rebuttal}
              onChange={e => setFormData({...formData, rebuttal: e.target.value})}
            />
          </div>

          {/* METADATOS (Riesgo y Etiquetas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/50">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Nivel de Riesgo
              </label>
              <select
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-100 focus:border-amber-500 outline-none"
                value={formData.risk}
                onChange={e => setFormData({...formData, risk: e.target.value as any})}
              >
                <option value="alto">🔴 Alto (Crítico)</option>
                <option value="medio">🟠 Medio (Gestionable)</option>
                <option value="bajo">🟢 Bajo (Irrelevante)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Etiquetas (Separadas por comas)
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none"
                placeholder="Ej: procesal, prescripción, prueba"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 py-4 text-sm font-bold text-white shadow-lg shadow-rose-900/20 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : '🛡️ Registrar Estrategia'}
            </button>
          </div>

        </form>
      </Card>
    </div>
  );
}
