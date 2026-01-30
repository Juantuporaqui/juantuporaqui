// ============================================
// CASE OPS - Validation Utilities
// ============================================

import { linksRepo } from '../db/repositories';
import type { Fact, Partida, FactStatus, PartidaState } from '../types';

/**
 * Check if a fact requires evidence
 */
export function factRequiresEvidence(status: FactStatus): boolean {
  return status === 'controvertido' || status === 'a_probar';
}

/**
 * Check if a partida requires evidence
 */
export function partidaRequiresEvidence(state: PartidaState): boolean {
  return state === 'discutida';
}

/**
 * Validate fact before save
 * Returns null if valid, error message if invalid
 */
export async function validateFact(
  fact: Partial<Fact>,
  skipEvidenceCheck = false
): Promise<string | null> {
  if (!fact.title?.trim()) {
    return 'El título es obligatorio';
  }

  if (!fact.caseId) {
    return 'Debe asociarse a un caso';
  }

  if (
    !skipEvidenceCheck &&
    fact.status &&
    factRequiresEvidence(fact.status) &&
    fact.id
  ) {
    const evidence = await linksRepo.getEvidenceForFact(fact.id);
    if (evidence.length === 0) {
      return `Un hecho con estado "${fact.status}" requiere al menos una evidencia vinculada`;
    }
  }

  return null;
}

/**
 * Validate partida before save
 */
export async function validatePartida(
  partida: Partial<Partida>,
  skipEvidenceCheck = false
): Promise<string | null> {
  if (!partida.concept?.trim()) {
    return 'El concepto es obligatorio';
  }

  if (!partida.caseId) {
    return 'Debe asociarse a un caso';
  }

  if (partida.amountCents === undefined || partida.amountCents < 0) {
    return 'El importe debe ser un número positivo';
  }

  if (!partida.date) {
    return 'La fecha es obligatoria';
  }

  if (
    !skipEvidenceCheck &&
    partida.state &&
    partidaRequiresEvidence(partida.state) &&
    partida.id
  ) {
    const evidence = await linksRepo.getEvidenceForPartida(partida.id);
    if (evidence.length === 0) {
      return `Una partida con estado "${partida.state}" requiere al menos una evidencia vinculada`;
    }
  }

  return null;
}

/**
 * Convert euros to cents (avoid floating point issues)
 */
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Convert cents to euros string
 */
export function centsToEuros(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Format cents as currency
 */
export function formatCurrency(cents: number, currency = 'EUR'): string {
  const euros = cents / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(euros);
}

/**
 * Parse currency input to cents
 */
export function parseCurrencyInput(input: string): number | null {
  // Remove currency symbols and spaces
  const cleaned = input.replace(/[€$\s]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return null;
  return eurosToCents(parsed);
}

/**
 * Validate file is PDF
 */
export function isPDF(file: File): boolean {
  return (
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf')
  );
}

/**
 * Check storage quota
 */
export async function checkStorageQuota(): Promise<{
  used: number;
  available: number;
  percentUsed: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage || 0;
    const available = estimate.quota || 0;
    const percentUsed = available > 0 ? (used / available) * 100 : 0;
    return { used, available, percentUsed };
  }
  return { used: 0, available: 0, percentUsed: 0 };
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
