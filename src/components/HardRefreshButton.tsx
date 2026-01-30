import React, { useMemo, useState } from "react";
import HardRefreshButton from "../../components/HardRefreshButton";

export default function ToolsPage() {
  const [advanced, setAdvanced] = useState(false);

  const hint = useMemo(() => {
    return advanced
      ? "Modo avanzado: además borra localStorage/sessionStorage (NO borra IndexedDB)."
      : "Modo seguro: solo desactiva Service Worker y borra Cache Storage (no toca tus datos).";
  }, [advanced]);

  return (
    <div style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, margin: "8px 0 14px", fontWeight: 800 }}>
        Herramientas
      </h1>

      <div
        style={{
          border: "1px solid rgba(0,0,0,.12)",
          borderRadius: 14,
          padding: 16,
          background: "rgba(0,0,0,.02)",
        }}
      >
        <h2 style={{ fontSize: 16, margin: "0 0 8px", fontWeight: 800 }}>
          Cache / PWA
        </h2>

        <p style={{ margin: "0 0 12px", opacity: 0.85, lineHeight: 1.35 }}>
          Si no estás viendo cambios después de desplegar, normalmente es porque el{" "}
          <b>Service Worker</b> y/o la <b>Cache Storage</b> están sirviendo assets antiguos.
          Este botón los desarma y fuerza recarga.
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <HardRefreshButton
            mode={advanced ? "cache-and-storage" : "cache-only"}
            label={advanced ? "Limpiar caché + storage y recargar" : "Limpiar caché y recargar"}
          />

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              userSelect: "none",
              fontWeight: 650,
            }}
          >
            <input
              type="checkbox"
              checked={advanced}
              onChange={(e) => setAdvanced(e.target.checked)}
            />
            Modo avanzado
          </label>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.78 }}>{hint}</div>

        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.78, lineHeight: 1.35 }}>
          <b>Nota:</b> esto <b>no borra IndexedDB</b> (Dexie), así que no pierdes datos del caso.
          Si quieres también un “reset total de datos”, eso es otra acción distinta (y peligrosa
          si no está bien controlada).
        </div>
      </div>
    </div>
  );
}
