import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gavel, FileText, Users, Search, Filter, ChevronDown,
  CheckCircle, Clock, AlertCircle, FileSearch, Scale
} from 'lucide-react';
import { AnalyticsLayout } from '../analytics/layout/AnalyticsLayout';
import { SectionCard } from '../analytics/components/SectionCard';
import {
  alegacionesComplementarias,
  hechosControvertidos,
  resumenAudiencia,
  type HechoControvertido,
  type TipoPrueba,
  type EstadoHechoControvertido
} from '../../data/audienciaPrevia';

// Configuración de estilos por estado
const estadoConfig: Record<EstadoHechoControvertido, { bg: string; border: string; text: string; icon: typeof Clock }> = {
  pendiente: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: Clock,
  },
  propuesto: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: AlertCircle,
  },
  admitido: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: CheckCircle,
  },
};

// Configuración de estilos por tipo de prueba
const pruebaConfig: Record<TipoPrueba, { bg: string; border: string; text: string; icon: typeof FileText; label: string }> = {
  documental: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    icon: FileText,
    label: 'Documental',
  },
  pericial: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    icon: Search,
    label: 'Pericial',
  },
  testifical: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: Users,
    label: 'Testifical',
  },
  interrogatorio: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    icon: Scale,
    label: 'Interrogatorio',
  },
};

type FilterEstado = 'todos' | EstadoHechoControvertido;
type FilterPrueba = 'todos' | TipoPrueba;

export function ModoAudienciaPage() {
  const navigate = useNavigate();
  const [filterEstado, setFilterEstado] = useState<FilterEstado>('todos');
  const [filterPrueba, setFilterPrueba] = useState<FilterPrueba>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedHecho, setExpandedHecho] = useState<number | null>(null);

  // Filtrar hechos
  const filteredHechos = useMemo(() => {
    return hechosControvertidos.filter((hecho) => {
      const matchEstado = filterEstado === 'todos' || hecho.estado === filterEstado;
      const matchPrueba = filterPrueba === 'todos' || hecho.tipoPrueba === filterPrueba;
      const matchSearch = searchTerm === '' ||
        hecho.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hecho.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      return matchEstado && matchPrueba && matchSearch;
    });
  }, [filterEstado, filterPrueba, searchTerm]);

  // Contadores
  const countByEstado = {
    pendiente: hechosControvertidos.filter(h => h.estado === 'pendiente').length,
    propuesto: hechosControvertidos.filter(h => h.estado === 'propuesto').length,
    admitido: hechosControvertidos.filter(h => h.estado === 'admitido').length,
  };

  const countByPrueba = {
    documental: hechosControvertidos.filter(h => h.tipoPrueba === 'documental').length,
    pericial: hechosControvertidos.filter(h => h.tipoPrueba === 'pericial').length,
    testifical: hechosControvertidos.filter(h => h.tipoPrueba === 'testifical').length,
    interrogatorio: hechosControvertidos.filter(h => h.tipoPrueba === 'interrogatorio').length,
  };

  return (
    <AnalyticsLayout
      title="Modo Audiencia"
      subtitle="Preparación de la Audiencia Previa - Picassent 715/2024"
      actions={
        <button
          type="button"
          onClick={() => navigate('/analytics')}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:bg-white/5 transition"
        >
          ← Dashboard
        </button>
      }
    >
      {/* Header con info de audiencia */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Gavel className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Audiencia Previa</h2>
              <p className="text-sm text-slate-400">{resumenAudiencia.juzgado}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {resumenAudiencia.fecha} • {resumenAudiencia.hora}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/50 text-slate-300">
                  {resumenAudiencia.sala}
                </span>
              </div>
            </div>
          </div>

          {/* KPIs rápidos */}
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-bold text-white">{resumenAudiencia.totalAlegaciones}</div>
              <div className="text-[10px] text-slate-400 uppercase">Alegaciones</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-bold text-white">{resumenAudiencia.totalHechosControvertidos}</div>
              <div className="text-[10px] text-slate-400 uppercase">Hechos</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <div className="text-2xl font-bold text-amber-400">{resumenAudiencia.hechosPendientes}</div>
              <div className="text-[10px] text-amber-300 uppercase">Pendientes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Buscador */}
        <div className="relative flex-1">
          <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar hechos controvertidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/50 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
          />
        </div>

        {/* Filtro por estado */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterEstado('todos')}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
              filterEstado === 'todos'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
            }`}
          >
            Todos ({hechosControvertidos.length})
          </button>
          {(['pendiente', 'propuesto', 'admitido'] as EstadoHechoControvertido[]).map((estado) => {
            const config = estadoConfig[estado];
            const Icon = config.icon;
            return (
              <button
                key={estado}
                type="button"
                onClick={() => setFilterEstado(filterEstado === estado ? 'todos' : estado)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                  filterEstado === estado
                    ? `${config.bg} ${config.text} border ${config.border}`
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {estado.charAt(0).toUpperCase() + estado.slice(1)} ({countByEstado[estado]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtro por tipo de prueba */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider self-center mr-2">Tipo de prueba:</span>
        {(['documental', 'pericial', 'testifical', 'interrogatorio'] as TipoPrueba[]).map((tipo) => {
          const config = pruebaConfig[tipo];
          const Icon = config.icon;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => setFilterPrueba(filterPrueba === tipo ? 'todos' : tipo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterPrueba === tipo
                  ? `${config.bg} ${config.text} border ${config.border}`
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.label} ({countByPrueba[tipo]})
            </button>
          );
        })}
      </div>

      {/* Tabla de Hechos Controvertidos */}
      <SectionCard
        title={`${filteredHechos.length} Hechos Controvertidos`}
        subtitle="Fijación de hechos para la audiencia previa"
      >
        <div className="space-y-3">
          {filteredHechos.map((hecho) => {
            const estadoCfg = estadoConfig[hecho.estado];
            const pruebaCfg = pruebaConfig[hecho.tipoPrueba];
            const EstadoIcon = estadoCfg.icon;
            const PruebaIcon = pruebaCfg.icon;
            const isExpanded = expandedHecho === hecho.id;

            return (
              <button
                key={hecho.id}
                type="button"
                onClick={() => setExpandedHecho(isExpanded ? null : hecho.id)}
                className={`
                  w-full text-left rounded-xl border ${estadoCfg.border} ${estadoCfg.bg}
                  p-4 transition-all duration-200
                  hover:shadow-lg hover:shadow-black/20
                  ${isExpanded ? 'ring-2 ring-emerald-500/30' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Header con número, estado y prueba */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 text-xs font-bold text-slate-300">
                        {hecho.id}
                      </span>

                      {/* Badge Estado */}
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${estadoCfg.bg} ${estadoCfg.text} border ${estadoCfg.border}`}>
                        <EstadoIcon className="w-3 h-3" />
                        {hecho.estado}
                      </span>

                      {/* Badge Tipo Prueba */}
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${pruebaCfg.bg} ${pruebaCfg.text} border ${pruebaCfg.border}`}>
                        <PruebaIcon className="w-3 h-3" />
                        {pruebaCfg.label}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="font-semibold text-white text-sm leading-tight mb-1">
                      {hecho.titulo}
                    </h3>

                    {/* Descripción (expandible) */}
                    <p className={`text-xs text-slate-400 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {hecho.descripcion}
                    </p>

                    {/* Notas (si expandido) */}
                    {isExpanded && hecho.notas && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Notas</div>
                        <p className="text-xs text-slate-300">{hecho.notas}</p>
                      </div>
                    )}
                  </div>

                  {/* Flecha expandir */}
                  <ChevronDown className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {filteredHechos.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No se encontraron hechos con los filtros seleccionados
          </div>
        )}
      </SectionCard>

      {/* Alegaciones Complementarias */}
      <SectionCard
        title={`${alegacionesComplementarias.length} Alegaciones Complementarias`}
        subtitle="Puntos a exponer en la audiencia"
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {alegacionesComplementarias.slice(0, 6).map((alegacion) => (
            <div
              key={alegacion.id}
              className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition"
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  {alegacion.id}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white mb-1">{alegacion.titulo}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{alegacion.contenido}</p>
                  {alegacion.fundamentoLegal && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-slate-700/50 text-slate-300">
                      {alegacion.fundamentoLegal}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {alegacionesComplementarias.length > 6 && (
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500">
              +{alegacionesComplementarias.length - 6} alegaciones más
            </span>
          </div>
        )}
      </SectionCard>
    </AnalyticsLayout>
  );
}
