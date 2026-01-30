// src/ui/components/TextReader.tsx

import React from 'react';

interface TextReaderProps {
  content: string; // El HTML del texto legal
  className?: string;
}

export function TextReader({ content, className = '' }: TextReaderProps) {
  return (
    <div className={`h-full flex flex-col bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden shadow-2xl ${className}`}>
      
      {/* Barra de herramientas superior (Estética) */}
      <div className="bg-slate-900/80 backdrop-blur px-6 py-3 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500/20 border border-rose-500"></span>
          <span className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500"></span>
        </div>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Vista de Lectura · Texto Original
        </div>
      </div>

      {/* Área de contenido con Scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Renderizado seguro del HTML */}
          <div 
            className="prose prose-invert prose-slate max-w-none 
                       prose-headings:font-serif prose-headings:tracking-tight
                       prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-justify
                       prose-strong:text-amber-500 prose-strong:font-bold
                       prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
          
          {/* Firma final decorativa */}
          <div className="mt-16 pt-8 border-t border-slate-800/50 flex justify-center">
             <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">Documento Digitalizado</p>
                <p className="text-xs text-slate-700 mt-1 font-mono">Case Ops v1.0</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
