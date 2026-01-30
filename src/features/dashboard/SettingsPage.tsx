// ============================================
// CASE OPS - Settings Page
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsRepo } from '../../db/repositories';
import { checkStorageQuota, formatBytes } from '../../utils/validators';
import type { Settings } from '../../types';

export function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [storage, setStorage] = useState({ used: 0, available: 0, percentUsed: 0 });
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const [settingsData, storageData] = await Promise.all([
        settingsRepo.get(),
        checkStorageQuota(),
      ]);

      if (settingsData) {
        setSettings(settingsData);
        setDeviceName(settingsData.deviceName);
      }
      setStorage(storageData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDeviceName() {
    if (!deviceName.trim()) return;

    try {
      await settingsRepo.update({ deviceName: deviceName.trim() });
      alert('Nombre del dispositivo guardado');
    } catch (error) {
      console.error('Error saving device name:', error);
      alert('Error al guardar');
    }
  }

  function handleThemeChange(theme: 'light' | 'dark' | 'system') {
    document.documentElement.setAttribute('data-theme', theme === 'system' ? '' : theme);
    settingsRepo.update({ theme });
  }

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1 }}>
          Ajustes
        </h1>
      </div>

      {/* Device Info */}
      <section className="section">
        <h2 className="section-title">Dispositivo</h2>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Nombre del dispositivo</label>
              <input
                type="text"
                className="form-input"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Mi Android, Mi PC..."
              />
              <p className="form-hint">
                Identifica este dispositivo en los backups
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleSaveDeviceName}>
              Guardar nombre
            </button>
          </div>
        </div>
      </section>

      {/* Vault Info */}
      <section className="section">
        <h2 className="section-title">Vault</h2>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">ID del Vault</label>
              <input
                type="text"
                className="form-input font-mono"
                value={settings?.vaultId || ''}
                readOnly
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
              <p className="form-hint">
                Identificador único de tu base de datos
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Versión del esquema</label>
              <input
                type="text"
                className="form-input"
                value={`v${settings?.schemaVersion || 1}`}
                readOnly
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="section">
        <h2 className="section-title">Almacenamiento</h2>
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-center mb-sm">
              <span>Usado</span>
              <span className="font-bold">{formatBytes(storage.used)}</span>
            </div>
            <div className="progress mb-sm">
              <div
                className="progress-bar"
                style={{ width: `${Math.min(storage.percentUsed, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-muted">
              <span>Disponible</span>
              <span>{formatBytes(storage.available)}</span>
            </div>
            {storage.percentUsed > 80 && (
              <div className="alert alert-warning mt-md">
                <span className="alert-icon">⚠️</span>
                <div className="alert-content">
                  <div className="alert-title">Almacenamiento bajo</div>
                  <div className="alert-description">
                    Considera exportar y eliminar documentos antiguos
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="section">
        <h2 className="section-title">Apariencia</h2>
        <div className="card">
          <div className="card-body">
            <div className="flex gap-sm">
              <button
                className={`btn ${settings?.theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleThemeChange('light')}
              >
                ☀️ Claro
              </button>
              <button
                className={`btn ${settings?.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleThemeChange('dark')}
              >
                🌙 Oscuro
              </button>
              <button
                className={`btn ${settings?.theme === 'system' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleThemeChange('system')}
              >
                🖥️ Sistema
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="section">
        <h2 className="section-title text-danger">Zona peligrosa</h2>
        <div className="card" style={{ borderColor: 'var(--color-danger)' }}>
          <div className="card-body">
            <p className="mb-md text-muted">
              Estas acciones no se pueden deshacer. Asegúrate de tener un backup.
            </p>
            <button
              className="btn btn-danger btn-block"
              onClick={() => {
                if (
                  confirm(
                    '¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.'
                  )
                ) {
                  // Would clear IndexedDB here
                  alert('Funcionalidad deshabilitada por seguridad');
                }
              }}
            >
              Borrar todos los datos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
