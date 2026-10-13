// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — HARDWARE FUZZY MATCHER & TYPO RESOLVER
// Principle: "EVO AI DEBE ENTENDER ERRORES DE ESCRITURA Y SUGERIR COINCIDENCIAS"
// ============================================================================

import { HardwareCatalogProvider, HardwareComponent } from './hardwareCatalog';

export interface TypoSuggestion {
  originalQuery: string;
  suggestedText: string;
  confidence: number;
  matchedComponent?: HardwareComponent;
  rationale: string;
}

export class HardwareFuzzyMatcher {
  /**
   * Normalizes strings by lowercasing, stripping extra whitespace, and fixing common typos (e.g. 'o' for '0')
   */
  static cleanQuery(query: string): string {
    return query
      .trim()
      .toLowerCase()
      .replace(/\b407o\b/gi, '4070')
      .replace(/\b408o\b/gi, '4080')
      .replace(/\b409o\b/gi, '4090')
      .replace(/\b406o\b/gi, '4060')
      .replace(/\b507o\b/gi, '5070')
      .replace(/\b508o\b/gi, '5080')
      .replace(/\b509o\b/gi, '5090')
      .replace(/kingstom/gi, 'kingston')
      .replace(/geforce\s*rtx/gi, 'rtx')
      .replace(/radeon\s*rx/gi, 'rx')
      .replace(/[\s\-_]+/g, ' ');
  }

  /**
   * Simple Levenshtein distance for fuzzy matching
   */
  static levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /**
   * Searches for potential matches and detects if a query contains a typo
   */
  static detectTypoAndSuggest(query: string, category?: string): TypoSuggestion | null {
    const raw = query.trim();
    if (raw.length < 3) return null;

    const cleaned = this.cleanQuery(raw);
    const all = HardwareCatalogProvider.getAllComponents();
    const pool = category ? all.filter((c) => c.category === category) : all;

    // Check if query is already an exact match
    const exactMatch = pool.some(
      (c) =>
        c.model.toLowerCase() === raw.toLowerCase() ||
        c.partNumber?.toLowerCase() === raw.toLowerCase()
    );
    if (exactMatch) return null;

    // 1. Common typo patterns check
    if (/407o/i.test(raw)) {
      const match = pool.find((c) => /4070\s*super/i.test(c.model)) || pool.find((c) => /4070/i.test(c.model));
      if (match) {
        return {
          originalQuery: raw,
          suggestedText: match.model,
          confidence: 96,
          matchedComponent: match,
          rationale: 'Se corrigió la letra "o" por el número "0" en el nombre del modelo.',
        };
      }
    }

    if (/b760\s*ma/i.test(raw) || /b760\s*m\s*a/i.test(raw)) {
      const match = pool.find((c) => /b760m-a/i.test(c.model));
      if (match) {
        return {
          originalQuery: raw,
          suggestedText: match.model,
          confidence: 94,
          matchedComponent: match,
          rationale: 'Coincidencia con ASUS PRIME B760M-A WIFI D4.',
        };
      }
    }

    if (/kingstom/i.test(raw)) {
      const match = pool.find((c) => c.manufacturer.toLowerCase() === 'kingston');
      if (match) {
        return {
          originalQuery: raw,
          suggestedText: match.model,
          confidence: 92,
          matchedComponent: match,
          rationale: 'Se corrigió "Kingstom" por "Kingston".',
        };
      }
    }

    // 2. Keyword tokens matching
    const tokens = cleaned.split(' ').filter((t) => t.length > 1);
    let bestMatch: HardwareComponent | null = null;
    let highestScore = 0;

    for (const comp of pool) {
      const targetStr = `${comp.manufacturer} ${comp.model} ${comp.partNumber || ''} ${comp.aliases.join(' ')}`.toLowerCase();
      let matchedTokens = 0;
      for (const tok of tokens) {
        if (targetStr.includes(tok)) matchedTokens++;
      }

      const score = matchedTokens / tokens.length;
      if (score > highestScore && score >= 0.6) {
        highestScore = score;
        bestMatch = comp;
      }
    }

    if (bestMatch && highestScore < 1.0) {
      return {
        originalQuery: raw,
        suggestedText: bestMatch.model,
        confidence: Math.round(highestScore * 100),
        matchedComponent: bestMatch,
        rationale: `Coincidencia parcial con ${bestMatch.manufacturer} ${bestMatch.model}.`,
      };
    }

    return null;
  }
}
