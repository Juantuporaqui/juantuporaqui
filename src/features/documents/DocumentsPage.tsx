import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsRepo } from '../../db/repositories'; // <--- Conexión a DB real
import type { Document } from '../../types';
import Card from '../../ui/components/Card';

export function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentsRepo.getAll().then((data) => {
      setDocs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Archivo</h1>
          <p className="text-sm text-slate-400">Evidencias y escritos</p>
        </div>
        <Link to="/documents/new" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500">
          + Subir
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {docs.length === 0 && (
           <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">
             Archivo vacío.
           </div>
        )}

        {docs.map((doc) => (
          <Card key={doc.id} className="p-4 flex items-center gap-4 hover:bg-slate-900/80 transition-colors cursor-pointer group">
            <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:bg-blue-900/30 group-hover:text-blue-400 transition-colors">
              {doc.docType === 'sentencia' ? '⚖️' : doc.docType === 'demanda' ? '📜' : '📄'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">{doc.title}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{doc.docType} • {(doc.size / 1024).toFixed(0)} KB</p>
            </div>
            <div className="text-slate-600">⋮</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
