import React from 'react';

interface TextReaderProps {
  content: string;
  className?: string;
}

export function TextReader({ content, className = '' }: TextReaderProps) {
  return (
    <div className={`h-full flex flex-col bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden shadow-2xl ${className}`}>
      
      {/* Barra superior estilo Mac/Editor */}
      <div className="bg-slate-900/80 backdrop-blur px-4 py-3 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/20 border border-rose-500/50"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          DOCUMENTO ORIGINAL DIGITALIZADO
        </div>
        <div className="w-10"></div> {/* Espaciador para centrar */}
      </div>

      {/* Contenido con Scroll */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-8 py-10">
          <div 
            className="prose prose-invert prose-sm md:prose-base max-w-none 
                       prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-100
                       prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-justify
                       prose-strong:text-amber-400 prose-strong:font-bold
                       prose-ul:list-disc prose-li:text-slate-300
                       prose-blockquote:border-l-amber-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
          
          {/* Pie de página decorativo */}
          <div className="mt-12 pt-8 border-t border-slate-800/30 flex justify-center">
             <div className="text-center opacity-40">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Fin del Documento</p>
                <div className="w-12 h-px bg-slate-700 mx-auto mt-2"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
