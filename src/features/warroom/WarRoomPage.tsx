import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { strategiesRepo } from '../../db/repositories';
import type { Strategy } from '../../types';
import Card from '../../ui/components/Card';

export function WarRoomPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    strategiesRepo.getAll().then((data) => {
      setStrategies(data);
      setLoading(false);
    });
  }, []);

  const getRiskColor = (riskText: string) => {
    const text = (riskText || '').toLowerCase();
    if (text.includes('alto')) return 'border-l-rose-500 bg-rose-500/5';
    if (text.includes('medio')) return 'border-l-amber-500 bg-amber-500/5';
    return 'border-l-emerald-500 bg-emerald-500/5';
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando inteligencia...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col gap-4">
        <div>
          <Link 
            to="/dashboard" 
            className="mb-4 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400 lg:hidden"
          >
            ← Volver al Panel
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            Estrategia
          </p>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            War Room
          </h1>
        </div>
        
        <Link
          to="/warroom/new"
          className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/20"
        >
          + Nueva Estrategia
        </Link>
      </header>

      {strategies.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-lg font-semibold text-slate-200">Sin estrategias</h3>
          <p className="text-slate-500 mb-6">Define tu primera línea de defensa.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {strategies.map((strategy) => (
            <Link
              key={strategy.id}
              to={`/warroom/${strategy.id}/edit`}
              className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition active:scale-95 border-l-4 ${getRiskColor(strategy.risk)}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono text-slate-500">#{strategy.id.slice(0, 4)}</span>
                  <div className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {strategy.caseId ? 'Vinculada' : 'General'}
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 leading-snug">
                  {strategy.attack}
                </h3>
                
                <div className="rounded-lg bg-black/40 p-3 border border-white/5">
                  <p className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider mb-1">
                    Respuesta
                  </p>
                  <p className="text-sm text-slate-300 line-clamp-3">
                    {strategy.rebuttal}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
