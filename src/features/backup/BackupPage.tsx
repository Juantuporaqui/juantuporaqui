// ============================================
// CASE OPS - Backup/Restore Page
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  exportToZip,
  importFromZip,
  downloadBlob,
  getExportFilename,
  type ExportProgress,
  type ImportProgress,
  type ImportResult,
} from '../../utils/zip';
import { formatDateTime } from '../../utils/dates';
import { formatBytes } from '../../utils/validators';

export function BackupPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  async function handleExport() {
    setExporting(true);
    setExportProgress(null);

    try {
      const blob = await exportToZip((progress) => {
        setExportProgress(progress);
      });

      const filename = getExportFilename();
      downloadBlob(blob, filename);

      alert(`Backup exportado: ${filename}\nTamaño: ${formatBytes(blob.size)}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error al exportar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setExporting(false);
      setExportProgress(null);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      alert('Selecciona un archivo ZIP');
      return;
    }

    const confirmed = confirm(
      `¿Importar backup "${file.name}"?\n\nSe fusionarán los datos usando la estrategia "el más reciente gana".`
    );

    if (!confirmed) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setImporting(true);
    setImportProgress(null);
    setImportResult(null);

    try {
      const result = await importFromZip(file, (progress) => {
        setImportProgress(progress);
      });

      setImportResult(result);

      if (result.success) {
        alert('Importación completada correctamente');
      } else {
        alert(
          'Importación completada con errores:\n' + result.errors.join('\n')
        );
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Error al importar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setImporting(false);
      setImportProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1 }}>
          Backup / Restore
        </h1>
      </div>

      {/* Export Section */}
      <section className="section">
        <h2 className="section-title">Exportar</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-md">
              Exporta todos los datos y documentos PDF a un archivo ZIP.
            </p>

            {exportProgress && (
              <div className="mb-md">
                <div className="progress mb-sm">
                  <div
                    className="progress-bar"
                    style={{ width: `${exportProgress.current}%` }}
                  />
                </div>
                <p className="text-muted text-center" style={{ fontSize: '0.875rem' }}>
                  {exportProgress.message}
                </p>
              </div>
            )}

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }} />
                  Exportando...
                </>
              ) : (
                <>💾 Exportar backup ZIP</>
              )}
            </button>

            <p className="form-hint mt-md">
              El archivo incluye: db.json (datos), docs/ (PDFs), manifest.json
            </p>
          </div>
        </div>
      </section>

      {/* Import Section */}
      <section className="section">
        <h2 className="section-title">Importar</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-md">
              Importa datos desde un backup ZIP. Los registros se fusionan usando la
              estrategia "el más reciente gana" (last-write-wins).
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleImport}
              style={{ display: 'none' }}
            />

            {importProgress && (
              <div className="mb-md">
                <div className="progress mb-sm">
                  <div
                    className="progress-bar"
                    style={{ width: `${importProgress.current}%` }}
                  />
                </div>
                <p className="text-muted text-center" style={{ fontSize: '0.875rem' }}>
                  {importProgress.message}
                </p>
              </div>
            )}

            <button
              className="btn btn-secondary btn-block btn-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              {importing ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }} />
                  Importando...
                </>
              ) : (
                <>📥 Seleccionar archivo ZIP</>
              )}
            </button>

            <div className="alert alert-warning mt-md">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <div className="alert-title">Estrategia de fusión</div>
                <div className="alert-description">
                  Si un registro existe en ambos sitios, se conserva el más reciente
                  según updatedAt. Los archivos PDF se deduiplican por hash SHA-256.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Import Result */}
      {importResult && (
        <section className="section">
          <h2 className="section-title">Resultado de importación</h2>
          <div className="card">
            <div className="card-body">
              <div
                className={`chip ${importResult.success ? 'chip-success' : 'chip-warning'} mb-md`}
              >
                {importResult.success ? 'Completado sin errores' : 'Completado con errores'}
              </div>

              <div className="grid grid-2 gap-sm">
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Casos
                  </p>
                  <p className="font-bold">{importResult.stats.casesImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Documentos
                  </p>
                  <p className="font-bold">{importResult.stats.documentsImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Archivos importados
                  </p>
                  <p className="font-bold">{importResult.stats.filesImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Archivos omitidos (ya existían)
                  </p>
                  <p className="font-bold">{importResult.stats.filesSkipped}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Spans
                  </p>
                  <p className="font-bold">{importResult.stats.spansImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Hechos
                  </p>
                  <p className="font-bold">{importResult.stats.factsImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Partidas
                  </p>
                  <p className="font-bold">{importResult.stats.partidasImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Enlaces
                  </p>
                  <p className="font-bold">{importResult.stats.linksImported}</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="mt-md">
                  <p className="text-danger font-bold mb-sm">Errores:</p>
                  {importResult.errors.map((error, i) => (
                    <p
                      key={i}
                      className="text-muted"
                      style={{ fontSize: '0.875rem' }}
                    >
                      • {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Instructions */}
      <section className="section">
        <h2 className="section-title">Sincronización manual</h2>
        <div className="card">
          <div className="card-body">
            <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.8 }}>
              <li>
                <strong>En el dispositivo origen:</strong> Exporta el backup ZIP
              </li>
              <li>
                <strong>Transfiere el archivo:</strong> Por cable USB, nube, email...
              </li>
              <li>
                <strong>En el dispositivo destino:</strong> Importa el archivo ZIP
              </li>
              <li>
                <strong>Repite en dirección contraria</strong> si ambos dispositivos tienen
                cambios
              </li>
            </ol>

            <div className="alert alert-info mt-md">
              <span className="alert-icon">💡</span>
              <div className="alert-content">
                <div className="alert-title">Tip</div>
                <div className="alert-description">
                  Los archivos PDF se deduiplican automáticamente. Si el mismo PDF existe
                  en ambos dispositivos (mismo hash SHA-256), no se duplicará.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
