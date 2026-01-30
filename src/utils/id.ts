// ============================================
// CASE OPS - ID Generation Utilities
// ============================================

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Parse ID to extract prefix and number
 */
export function parseId(id: string): { prefix: string; number: number } | null {
  const match = id.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    number: parseInt(match[2], 10),
  };
}

/**
 * Format ID with leading zeros
 */
export function formatId(prefix: string, number: number, digits = 3): string {
  return `${prefix}${String(number).padStart(digits, '0')}`;
}
