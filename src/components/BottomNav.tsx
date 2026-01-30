// ============================================
// CASE OPS - Mobile Bottom Navigation
// ============================================

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  Gavel,
  Wrench,
  Menu
} from 'lucide-react';

export function BottomNav() {
  const NAV_ITEMS = [
    { to: '/dashboard', label: 'Inicio', icon: <LayoutDashboard size={20} /> },
    { to: '/cases', label: 'Casos', icon: <Scale size={20} /> },
    { to: '/audiencia-previa', label: 'Audiencia', icon: <Gavel size={20} /> },
    { to: '/tools', label: 'Tools', icon: <Wrench size={20} /> },
    { to: '/more', label: 'Menú', icon: <Menu size={20} /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full space-y-1
              ${isActive 
                ? 'text-amber-500' 
                : 'text-slate-500 hover:text-slate-300'
              }
            `}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
