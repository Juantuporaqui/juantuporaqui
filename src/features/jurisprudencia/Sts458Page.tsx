import { useMemo, useState } from 'react';
import sts458 from '../../content/sts458.json';

type Block = { type: 'p' | 'bullet'; text: string };
type Section = { id: string; num: string; title: string; blocks: Block[] };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  // Permite búsqueda por varias palabras: "prescripción dies a quo"
  const parts = q.split(/\s+/).filter(Boolean).slice(0, 6);
  if (parts.length === 0) return <>{text}</>;

  const re = new RegExp(`(${parts.map(escapeRegExp).join('|')})`, 'ig');
  const chunks = text.split(re);

  return (
    <>
      {chunks.map((c, i) => {
        const isHit = parts.some(p => c.toLowerCase() === p.toLowerCase());
        return isHit ? (
          <mark
            key={i}
            className="rounded bg-amber-500/20 px-1 text-amber-200 ring-1 ring-amber-500/30"
          >
            {c}
          </mark>
        ) : (
          <span key={i}>{c}</span>
        );
      })}
    </>
  );
}

function matchesSection(sec: Section, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (sec.title.toLowerCase().includes(q)) return true;

  // Búsqueda "AND" ligera: si hay varias palabras, que coincida al menos 1 (rápido y útil).
  const parts = q.split(/\s+/).filter(Boolean);
  return sec.blocks.some(b => parts.some(p => b.text.toLowerCase().includes(p)));
}

export function Sts458Page() {
  const [query, setQuery] = useState('');
  const [onlyMatches, setOnlyMatches] = useState(true);

  const meta = (sts458 as any).meta as {
    title: string;
    subtitle: string;
    sourceDoc: string;
    disclaimer: string;
  };

  const sections = (sts458 as any).sections as Section[];

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return sections;

    if (!onlyMatches) return sections;

    return sections.filter(s => matchesSection(s, q));
  }, [sections, query, onlyMatches]);

  const onCopyLink = async (id: string) => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/juris/sts458#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback silencioso
      const tmp = document.createElement('textarea');
      tmp.value = url;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Jurisprudencia • Informe interno
          </p>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{meta.title}</h1>
          <p className="text-sm text-slate-400 mt-1">{meta.subtitle}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              className="text-xs rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-200 hover:bg-slate-900"
              href={`${import.meta.env.BASE_URL}docs/${meta.sourceDoc}`}
              target="_blank"
              rel="noreferrer"
              title="Abrir el DOCX original"
            >
              Abrir DOCX
            </a>
            <span className="text-xs text-slate-600">{meta.disclaimer}</span>
          </div>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[360px]">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <label className="text-xs font-semibold text-slate-300">Buscar dentro del informe</label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ej: prescripción, dies a quo, nómina, solidaridad, receptoras…"
              className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={onlyMatches}
                  onChange={e => setOnlyMatches(e.target.checked)}
                  className="accent-amber-500"
                />
                Mostrar solo secciones que coincidan
              </label>
              <button
                onClick={() => {
                  setQuery('');
                  setOnlyMatches(true);
                }}
                className="text-xs rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1 text-slate-300 hover:bg-slate-900"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Contenido */}
        <main className="space-y-4">
          {filtered.map(sec => (
            <section
              key={sec.id}
              id={sec.id}
              className="rounded-xl border border-slate-800 bg-slate-950/40 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-100">
                    <span className="text-amber-300">{sec.num})</span> {sec.title}
                  </h2>
                </div>
                <button
                  onClick={() => onCopyLink(sec.id)}
                  className="shrink-0 text-xs rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1 text-slate-300 hover:bg-slate-900"
                  title="Copiar enlace directo a esta sección"
                >
                  Copiar link
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {/* Render: bullets agrupados */}
                {sec.blocks.map((b, i) => {
                  if (b.type === 'bullet') {
                    // agrupar bullets consecutivos
                    const group: Block[] = [];
                    let j = i;
                    while (j < sec.blocks.length && sec.blocks[j].type === 'bullet') {
                      group.push(sec.blocks[j]);
                      j++;
                    }
                    // saltar render duplicado: solo en el primer bullet del grupo
                    if (i > 0 && sec.blocks[i - 1].type === 'bullet') return null;

                    return (
                      <ul key={`ul-${i}`} className="list-disc pl-6 space-y-1 text-sm text-slate-200">
                        {group.map((it, k) => (
                          <li key={k}>
                            <Highlight text={it.text} query={query} />
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={i} className="text-sm text-slate-200 leading-relaxed">
                      <Highlight text={b.text} query={query} />
                    </p>
                  );
                })}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-slate-300">
              No hay coincidencias.
            </div>
          )}
        </main>

        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Índice
            </div>
            <div className="mt-3 space-y-2 max-h-[70vh] overflow-auto pr-1">
              {sections.map(sec => {
                const active = !!query.trim() && matchesSection(sec, query);
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={[
                      'block text-xs rounded-lg px-2 py-1.5 border transition-colors',
                      active
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40',
                    ].join(' ')}
                    title={`${sec.num}) ${sec.title}`}
                  >
                    <span className="text-amber-300">{sec.num})</span> {sec.title}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Sts458Page;
