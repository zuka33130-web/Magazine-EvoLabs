// ============================================================================
// EVO LOCAL AGENT — SECURITY MIDDLEWARE & INTEGRITY CONTROLS
// Principle: Local-only, Origin-verified, Session-tokenized, Zero-Arbitrary-Execution
// ============================================================================

import crypto from 'crypto';
import http from 'http';

export class AgentSecurityManager {
  private sessionToken: string;

  constructor() {
    // Generate a high-entropy 256-bit cryptographic token on agent startup
    this.sessionToken = crypto.randomBytes(32).toString('hex');
  }

  public getSessionToken(): string {
    return this.sessionToken;
  }

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
      const originBase = `${parsed.protocol}//${parsed.host}`;
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

    // Set CORS headers strictly for permitted origins
    if (originBase) {
      res.setHeader('Access-Control-Allow-Origin', originBase);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Evo-Agent-Token, X-Requested-With'
    );
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

    // Constant-time comparison to prevent timing attacks
    if (cleanToken.length !== this.sessionToken.length) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(this.sessionToken));
  }

  /**
   * Enforces strict endpoint path format and forbids traversal
   */
  public sanitizePath(urlPath: string): string {
    const parsed = new URL(urlPath, 'http://127.0.0.1:43921');
    return parsed.pathname.replace(/\/+/g, '/').toLowerCase();
  }
}
