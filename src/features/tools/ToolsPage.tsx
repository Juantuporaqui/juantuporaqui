import { useEffect, useState } from 'react';
// CHALADITA CASE-OPS
import { ProcedimientosChaladita } from '../../components/ProcedimientosChaladita';
import { HechosQuickNav } from '../../components/HechosQuickNav';
import { AudienciaQuickNav } from '../../components/AudienciaQuickNav';
import { useProcedimientos } from '../../db/chaladitaRepos';

export function ToolsPage() {
  const procedimientos = useProcedimientos();
  const [selectedProcId, setSelectedProcId] = useState<string>('');

  // Seleccionar primer procedimiento Chaladita
  useEffect(() => {
    if (procedimientos.length > 0 && !selectedProcId) {
      setSelectedProcId(procedimientos[0].id);
    }
  }, [procedimientos, selectedProcId]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Herramientas
          </p>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Chaladita Case-Ops
          </h1>
          <p className="text-sm text-slate-400">
            Acceso rápido a procedimientos, hechos y secciones de audiencia.
          </p>
        </div>
        {procedimientos.length > 0 && (
          <select
            value={selectedProcId}
            onChange={(e) => setSelectedProcId(e.target.value)}
            className="rounded-xl border border-amber-500/30 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
          >
            {procedimientos.map((proc) => (
              <option key={proc.id} value={proc.id}>
                {proc.nombre}
              </option>
            ))}
          </select>
        )}
      </header>

      {/* Quick Nav - Botones estilo app móvil */}
      {selectedProcId && (
        <div className="grid lg:grid-cols-2 gap-6">
          <HechosQuickNav procedimientoId={selectedProcId} />
          <AudienciaQuickNav procedimientoId={selectedProcId} />
        </div>
      )}

      {/* Vista completa de procedimientos */}
      {procedimientos.length > 0 && (
        <section className="mt-8 pt-8 border-t border-amber-500/20">
          <ProcedimientosChaladita />
        </section>
      )}

      {procedimientos.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No hay procedimientos cargados.</p>
          <p className="text-sm mt-2">Añade ?reseed=1 a la URL para cargar datos de ejemplo.</p>
        </div>
      )}
    </div>
  );
}
