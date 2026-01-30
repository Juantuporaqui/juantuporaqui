import { useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/schema';
import type { AnalyticsMeta } from '../../../types';
import { DEFAULT_ANALYTICS_META } from '../utils/analytics';

async function ensureAnalyticsMeta(): Promise<AnalyticsMeta> {
  const existing = await db.analytics_meta.get('global');
  if (existing) {
    const merged: AnalyticsMeta = {
      ...DEFAULT_ANALYTICS_META,
      ...existing,
      lineaTemporal: existing.lineaTemporal ?? DEFAULT_ANALYTICS_META.lineaTemporal,
      courts: existing.courts ?? DEFAULT_ANALYTICS_META.courts,
      prescripcion: {
        ...DEFAULT_ANALYTICS_META.prescripcion,
        ...existing.prescripcion,
      },
      pendientes: existing.pendientes ?? DEFAULT_ANALYTICS_META.pendientes,
    };
    if (JSON.stringify(merged) !== JSON.stringify(existing)) {
      await db.analytics_meta.put({
        ...merged,
        updatedAt: new Date().toISOString(),
      });
    }
    return merged;
  }

  const fresh: AnalyticsMeta = {
    ...DEFAULT_ANALYTICS_META,
    updatedAt: new Date().toISOString(),
  };
  await db.analytics_meta.put(fresh);
  return fresh;
}

export function useAnalyticsMeta() {
  const meta = useLiveQuery(async () => db.analytics_meta.get('global'), []);

  useEffect(() => {
    void ensureAnalyticsMeta();
  }, []);

  const saveMeta = useCallback(async (next: AnalyticsMeta) => {
    const payload = {
      ...next,
      id: 'global',
      updatedAt: new Date().toISOString(),
    };
    await db.analytics_meta.put(payload);
  }, []);

  return { meta, saveMeta };
}
