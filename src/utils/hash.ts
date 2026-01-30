// ============================================
// CASE OPS - Hash Utilities (SHA-256)
// ============================================

/**
 * Calculate SHA-256 hash of a Blob/File
 */
export async function sha256(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Calculate SHA-256 hash of a string
 */
export async function sha256String(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Simple hash for PIN storage (not cryptographically secure for real passwords)
 */
export async function hashPin(pin: string): Promise<string> {
  return sha256String(pin + 'case-ops-salt');
}

/**
 * Verify PIN against stored hash
 */
export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  const hash = await hashPin(pin);
  return hash === storedHash;
}
