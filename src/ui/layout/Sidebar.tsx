import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Scale,
  FileText,
  Target,
  CheckSquare,
  Calendar,
  Search,
  Gavel,
  Wrench,
  BookOpen,
  RefreshCw
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Panel', icon: <LayoutDashboard size={18} /> },
  { to: '/cases', label: 'Expedientes', icon: <Scale size={18} /> },
  { to: '/search', label: 'Buscador', icon: <Search size={18} /> },
  { to: '/documents', label: 'Documental', icon: <FileText size={18} /> },
  { to: '/audiencia-previa', label: 'Audiencia', icon: <Gavel size={18} /> },
  { to: '/tools', label: 'Herramientas', icon: <Wrench size={18} /> },
  { to: '/juris/sts458', label: 'STS 458/2025', icon: <BookOpen size={18} /> },
  { to: '/warroom', label: 'Estrategia', icon: <Target size={18} /> },
  { to: '/events', label: 'Agenda', icon: <Calendar size={18} /> },
  { to: '/tasks', label: 'Tareas', icon: <CheckSquare size={18} /> },
];

export function Sidebar() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // Limpiar Service Worker cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      // Limpiar localStorage (excepto datos críticos)
      const keysToKeep = ['theme', 'user-preferences'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      // Forzar recarga completa desde servidor
      window.location.reload();
    } catch (error) {
      console.error('Error limpiando caché:', error);
      window.location.reload();
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 h-screen fixed z-50">
      {/* Header del Sidebar */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/20">
          C
        </div>
        <span className="text-white font-bold tracking-tight text-lg">CASE OPS</span>
        {/* Botón Limpiar Caché */}
        <button
          onClick={handleClearCache}
          disabled={isClearing}
          title="Limpiar caché y recargar"
          className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={isClearing ? 'animate-spin' : ''} />
        </button>
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {NAV_ITEMS.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
              ${isActive 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }
            `}
          >
            <span className={({ isActive }: { isActive: boolean }) => isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      {/* Footer del sidebar */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>v0.1.0 Alpha • Online</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
