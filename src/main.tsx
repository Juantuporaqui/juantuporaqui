import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as pdfjsLib from 'pdfjs-dist'
import './index.css'
import App from './App.tsx'

// Chaladita Case-Ops bootstrap
import { isDbEmpty, importSeed, resetDb } from './db/chaladitaDb'
import { seedCaseOps } from './data/seed.caseops'

// Configura el worker solo si no hay una ruta previa definida.
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js', {
    updateViaCache: 'none',
  })
}

// Bootstrap Chaladita DB: seed si vacía, reseed con ?reseed=1
async function bootstrapChaladita() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('reseed') === '1') {
    await resetDb()
    await importSeed(seedCaseOps)
    // Limpiar URL sin recargar
    window.history.replaceState({}, '', window.location.pathname)
    console.log('[Chaladita] DB reseed completo')
  } else if (await isDbEmpty()) {
    await importSeed(seedCaseOps)
    console.log('[Chaladita] DB inicializada con seed')
  }
}

// Ejecutar bootstrap y luego render
bootstrapChaladita().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
