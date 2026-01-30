import { useEffect, useState } from 'react';
// FASE 2 - Chaladita Case-Ops
import { useProcedimientos } from '../../db/chaladitaRepos';
import { UploadDocumento } from '../../components/UploadDocumento';
// Quick Nav - Botones estilo app móvil
import { HechosQuickNav } from '../../components/HechosQuickNav';
import { AudienciaQuickNav } from '../../components/AudienciaQuickNav';

export function AudienciaPreviaPage() {
  // Chaladita
  const procedimientos = useProcedimientos();
  const [selectedProcId, setSelectedProcId] = useState<string>('');
  const [showUpload, setShowUpload] = useState(false);

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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Chaladita Case-Ops
          </p>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Audiencia Previa
          </h1>
          <p className="text-sm text-slate-400">
            Preparación de audiencia con acceso rápido a hechos y secciones.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200"
          >
            {showUpload ? 'Cerrar' : '+ Subir Doc'}
          </button>
        </div>
      </header>

      {showUpload && selectedProcId && (
        <div className="mb-6">
          <UploadDocumento
            procedimientoId={selectedProcId}
            onSuccess={() => {
              setShowUpload(false);
              alert('Documento guardado correctamente');
            }}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      {selectedProcId && (
        <div className="grid lg:grid-cols-2 gap-6">
          <HechosQuickNav procedimientoId={selectedProcId} />
          <AudienciaQuickNav procedimientoId={selectedProcId} />
        </div>
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
