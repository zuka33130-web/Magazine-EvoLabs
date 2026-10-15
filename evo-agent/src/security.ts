// ============================================================================
// EVO LOCAL AGENT — SECURITY MIDDLEWARE & INTEGRITY CONTROLS
// Principle: Local-only, Origin-verified, Session-tokenized, Zero-Arbitrary-Execution
// ============================================================================

import crypto from 'crypto';
import http from 'http';

export class AgentSecurityManager {
  private pairingCode = '';
  private codeExpiresAt = 0;
  private attempts = 0;
  private blockedUntil = 0;
  private tokens = new Map<string, { token: string; expiresAt: number }>();
  constructor(private readonly announceCode: (code: string) => void = () => {}, private readonly now: () => number = Date.now) {
    this.rotateCode();
  }
  private rotateCode(): void {
    const previous = this.pairingCode;
    do { this.pairingCode = crypto.randomInt(100000, 1000000).toString(); } while (this.pairingCode === previous);
    this.codeExpiresAt = this.now() + 5 * 60 * 1000;
    this.announceCode(this.pairingCode);
  }
  public pair(code: unknown, origin: string | undefined): { sessionToken: string; expiresAt: string } {
    if (!this.isOriginAllowed(origin).allowed) throw new Error('FORBIDDEN_ORIGIN');
    if (this.now() < this.blockedUntil) throw new Error('PAIRING_RATE_LIMITED');
    if (this.now() >= this.codeExpiresAt) { this.rotateCode(); this.attempts = 0; throw new Error('PAIRING_CODE_EXPIRED'); }
    const candidate = typeof code === 'string' && /^\d{6}$/.test(code) ? code : '';
    if (!candidate || !crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(this.pairingCode))) {
      if (++this.attempts >= 5) { this.blockedUntil = this.now() + 60000; this.attempts = 0; this.rotateCode(); }
      throw new Error(this.now() < this.blockedUntil ? 'PAIRING_RATE_LIMITED' : 'PAIRING_CODE_INVALID');
    }
    for (const [key, entry] of this.tokens) if (entry.expiresAt <= this.now()) this.tokens.delete(key);
    const key = origin || 'LOCAL_CLI';
    if (!this.tokens.has(key) && this.tokens.size >= 8) throw new Error('PAIRING_SESSION_LIMIT');
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = this.now() + 8 * 60 * 60 * 1000;
    this.tokens.set(key, { token: sessionToken, expiresAt });
    this.attempts = 0; this.rotateCode();
    return { sessionToken, expiresAt: new Date(expiresAt).toISOString() };
  }
  public revoke(origin: string | undefined): void { this.tokens.delete(origin || 'LOCAL_CLI'); }

  private static readonly ALLOWED_EXACT_ORIGINS = new Set([
    'https://ais-dev-ozfhvuxwnhwwzmlhkvf4sw-135361764474.us-east1.run.app',
    'https://ais-pre-ozfhvuxwnhwwzmlhkvf4sw-135361764474.us-east1.run.app',
  ]);

  /**
   * Verifies if an origin is permitted:
   * Permitted: localhost, 127.0.0.1, or exact authorized preview origins.
   * Prohibited: open wildcards, *.run.app, *.google.com, or reflective CORS.
   */
  public isOriginAllowed(originHeader: string | undefined): { allowed: boolean; originBase?: string } {
    if (!originHeader) {
      // Local processes, CLI tools, tests without Origin header
      return { allowed: true };
    }

    try {
      const parsed = new URL(originHeader);
      const originBase = parsed.origin;
      if (!['http:', 'https:'].includes(parsed.protocol) || originHeader !== originBase) return { allowed: false };
      const hostname = parsed.hostname.toLowerCase();

      const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
      const isAllowedExact = AgentSecurityManager.ALLOWED_EXACT_ORIGINS.has(originBase);

      if (isLocalHost || isAllowedExact) {
        return { allowed: true, originBase };
      }

      return { allowed: false };
    } catch {
      return { allowed: false };
    }
  }

  /**
   * Applies CORS headers and validates that the request origin is authorized.
   * NO reflective CORS, NO open wildcard CORS (*).
   */
  public handleCorsAndSecurity(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): { isPreflight: boolean; isAllowed: boolean; error?: string } {
    const origin = req.headers.origin;
    const { allowed, originBase } = this.isOriginAllowed(origin);

    if (!allowed) {
      return { isPreflight: false, isAllowed: false, error: 'FORBIDDEN_ORIGIN' };
    }

    const host = req.headers.host?.split(':')[0]?.toLowerCase();
    if (host !== '127.0.0.1' && host !== 'localhost') return { isPreflight: false, isAllowed: false, error: 'FORBIDDEN_HOST' };
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Origin');

    // Set CORS headers strictly for permitted origins
    if (originBase) {
      res.setHeader('Access-Control-Allow-Origin', originBase);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Evo-Agent-Token, X-Requested-With'
    );
    if (originBase && req.headers['access-control-request-private-network'] === 'true') res.setHeader('Access-Control-Allow-Private-Network', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    // Handle Preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return { isPreflight: true, isAllowed: true };
    }

    return { isPreflight: false, isAllowed: true };
  }

  /**
   * Identifies endpoints that strictly require a valid session token
   */
  public isProtectedEndpoint(method: string, cleanPath: string): boolean {
    const m = (method || 'GET').toUpperCase();
    if (m === 'POST' && cleanPath === '/v1/pair/revoke') return true;
    if (m === 'GET' && cleanPath === '/v1/machine') return true;
    if (m === 'GET' && cleanPath === '/v1/telemetry') return true;
    if (m === 'POST' && cleanPath === '/v1/telemetry/start') return true;
    if (m === 'POST' && cleanPath === '/v1/telemetry/stop') return true;
    return false;
  }

  /**
   * Validates request token against agent's session token.
   * Missing or invalid token returns false.
   */
  public validateToken(req: http.IncomingMessage): boolean {
    const headerToken = req.headers['x-evo-agent-token'] || req.headers['authorization'];
    if (!headerToken) {
      return false;
    }

    const rawToken = Array.isArray(headerToken) ? headerToken[0] : headerToken;
    const cleanToken = rawToken.replace(/^Bearer\s+/i, '').trim();

    if (!cleanToken) {
      return false;
    }

    const entry = this.tokens.get(req.headers.origin || 'LOCAL_CLI');
    if (!entry || entry.expiresAt <= this.now()) return false;
    // Compare byte lengths (not JS character counts) before timingSafeEqual.
    if (Buffer.byteLength(cleanToken) !== Buffer.byteLength(entry.token)) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(entry.token));
  }

  /**
   * Enforces strict endpoint path format and forbids traversal
   */
  public sanitizePath(urlPath: string): string {
    const parsed = new URL(urlPath, 'http://127.0.0.1:43921');
    return parsed.pathname.replace(/\/+/g, '/').toLowerCase();
  }
}
