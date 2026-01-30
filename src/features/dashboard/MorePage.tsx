// ============================================
// CASE OPS - More Page (Extended Navigation)
// ============================================

import { Link } from 'react-router-dom';
import { ListItem } from '../../components';

const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Panel de control', subtitle: 'Resumen general' },
  { path: '/cases', icon: '⚖️', label: 'Casos', subtitle: 'Gestionar procedimientos' },
  { path: '/events', icon: '📅', label: 'Cronología', subtitle: 'Línea temporal' },
  { path: '/warroom', icon: '🎯', label: 'War Room', subtitle: 'Estrategias y ataques' },
  { path: '/tasks', icon: '✅', label: 'Tareas', subtitle: 'Acciones pendientes' },
  { path: '/backup', icon: '💾', label: 'Backup/Restore', subtitle: 'Exportar e importar' },
  { path: '/settings', icon: '⚙️', label: 'Ajustes', subtitle: 'Configuración de la app' },
];

export function MorePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Más opciones</h1>
      </div>

      <div className="card">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem
              icon={<span style={{ fontSize: '1.5rem' }}>{item.icon}</span>}
              title={item.label}
              subtitle={item.subtitle}
              action={<span>›</span>}
            />
          </Link>
        ))}
      </div>

      <div className="mt-lg text-center text-muted">
        <p>Case Ops v1.0.0</p>
        <p style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)' }}>
          PWA Offline-First para gestión de litigio
        </p>
      </div>
    </div>
  );
}
