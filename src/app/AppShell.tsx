// ============================================
// CASE OPS - Main Application Shell
// ============================================

import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Sidebar } from '../ui/layout/Sidebar';
import { BottomNav } from '../components/BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      
      {/* 1. Sidebar para Desktop (Izquierda) */}
      <Sidebar />

      {/* 2. Área de Contenido Principal */}
      <main className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300">
        
        {/* Contenedor con padding responsivo */}
        <div className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          <Outlet />
        </div>

      </main>

      {/* 3. Navegación Inferior para Móvil (Solo visible en pantallas pequeñas) */}
      <BottomNav />

      {/* Utilidades Globales */}
      <ScrollRestoration />
    </div>
  );
}
