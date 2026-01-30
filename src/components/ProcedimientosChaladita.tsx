// ============================================
// CHALADITA CASE-OPS - Vista de Procedimientos
// Lista de procedimientos con hechos expandibles
// ============================================

import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { chaladitaDb } from '../db/chaladitaDb';
import { useProcedimientos, useHechosByProcedimiento, useTotalReclamado, useTotalPrescrito } from '../db/chaladitaRepos';
import { HechoCardChaladitaExpandible } from './HechoCardChaladita';
import type { ProcedimientoCase, HechoCase } from '../types/caseops';

// Componente para mostrar los hechos de un procedimiento
function HechosList({ procedimientoId }: { procedimientoId: string }) {
  const hechos = useHechosByProcedimiento(procedimientoId);
  const documentos = useLiveQuery(
    () => chaladitaDb.documentos.where('procedimientoId').equals(procedimientoId).toArray(),
    [procedimientoId]
  );

  // Contar documentos vinculados por hecho
  const docsCountByHecho = useMemo(() => {
    const counts: Record<string, number> = {};
    if (documentos) {
      for (const doc of documentos) {
        for (const hechoId of doc.hechosIds) {
          counts[hechoId] = (counts[hechoId] || 0) + 1;
        }
      }
    }
    return counts;
  }, [documentos]);

  if (hechos.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-4">
        No hay hechos registrados para este procedimiento.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {hechos.map((hecho) => (
        <HechoCardChaladitaExpandible
          key={hecho.id}
          hecho={hecho}
          documentosVinculados={docsCountByHecho[hecho.id] || 0}
        />
      ))}
    </div>
  );
}

// Card de procedimiento
function ProcedimientoCard({ proc, isSelected, onSelect }: {
  proc: ProcedimientoCase;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const totalReclamado = useTotalReclamado(proc.id);
  const totalPrescrito = useTotalPrescrito(proc.id);

  const estadoColors: Record<string, string> = {
    'Preparación': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'En trámite': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'Señalado': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    'Ejecución': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'Cerrado': 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-200
        ${isSelected
          ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Estado badge */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${estadoColors[proc.estado] || estadoColors['Preparación']}`}>
              {proc.estado}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {proc.autos}
            </span>
          </div>

          {/* Nombre */}
          <h3 className="font-semibold text-white text-sm leading-tight mb-1">
            {proc.nombre}
          </h3>

          {/* Juzgado */}
          <p className="text-xs text-slate-400 truncate mb-2">
            {proc.juzgado}
          </p>

          {/* Objetivo */}
          <p className="text-xs text-slate-500 line-clamp-2">
            {proc.objetivoInmediato}
          </p>

          {/* Totales */}
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-700/50">
            <div>
              <span className="text-[10px] text-slate-500 block">Reclamado</span>
              <span className="text-sm font-bold text-emerald-400">
                {(totalReclamado / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
              </span>
            </div>
            {totalPrescrito > 0 && (
              <div>
                <span className="text-[10px] text-slate-500 block">Prescrito</span>
                <span className="text-sm font-bold text-rose-400">
                  {(totalPrescrito / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Indicador selección */}
        {isSelected && (
          <span className="text-amber-400">▶</span>
        )}
      </div>
    </button>
  );
}

// Componente principal
export function ProcedimientosChaladita() {
  const procedimientos = useProcedimientos();
  const [selectedProcId, setSelectedProcId] = useState<string>('');

  // Seleccionar el primer procedimiento al cargar
  if (procedimientos.length > 0 && !selectedProcId) {
    setSelectedProcId(procedimientos[0].id);
  }

  const selectedProc = procedimientos.find((p) => p.id === selectedProcId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 mb-1">
          Chaladita Case-Ops
        </p>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Procedimientos
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {procedimientos.length} procedimientos cargados. Selecciona uno para ver sus hechos.
        </p>
      </div>

      {/* Layout: lista + detalle */}
      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        {/* Lista de procedimientos */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Procedimientos
          </h2>
          {procedimientos.map((proc) => (
            <ProcedimientoCard
              key={proc.id}
              proc={proc}
              isSelected={proc.id === selectedProcId}
              onSelect={() => setSelectedProcId(proc.id)}
            />
          ))}
        </div>

        {/* Detalle: Hechos del procedimiento seleccionado */}
        <div>
          {selectedProc ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Hechos de
                  </h2>
                  <h3 className="text-lg font-bold text-slate-100">
                    {selectedProc.nombre}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedProc.id}
                </span>
              </div>
              <HechosList procedimientoId={selectedProcId} />
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Selecciona un procedimiento para ver sus hechos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProcedimientosChaladita;
