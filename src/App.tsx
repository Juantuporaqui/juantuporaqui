// ============================================
// CASE OPS - Main App Component
// ============================================

import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { seedDatabase } from './db/seed';
import './index.css';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      // Seed database on first run
      await seedDatabase();
      setInitialized(true);
    } catch (err) {
      console.error('Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  if (error) {
    return (
      <div className="page" style={{ padding: 20, textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-danger)' }}>Error de inicialización</h1>
        <p>{error}</p>
        <button
          className="btn btn-primary mt-md"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div className="spinner" style={{ width: 40, height: 40 }} />
        <p style={{ color: 'var(--text-secondary)' }}>Inicializando Case Ops...</p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
