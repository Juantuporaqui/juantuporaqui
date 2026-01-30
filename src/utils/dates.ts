// ============================================
// CASE OPS - Date Utilities
// ============================================

/**
 * Format timestamp to locale date string
 */
export function formatDate(timestamp: number | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format timestamp to locale datetime string
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format timestamp to relative time (e.g., "hace 2 horas")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(timestamp);
  } else if (days > 0) {
    return `hace ${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else {
    return 'ahora mismo';
  }
}

/**
 * Get ISO date string (YYYY-MM-DD)
 */
export function toISODate(date: Date | number | string): string {
  const d = typeof date === 'string' ? new Date(date) : date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Check if date is in the past
 */
export function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

/**
 * Check if date is today
 */
export function isToday(dateStr: string): boolean {
  const today = toISODate(new Date());
  return dateStr === today;
}

/**
 * Get current ISO date
 */
export function getCurrentDate(): string {
  return toISODate(new Date());
}
