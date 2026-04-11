import { sha256, generateNonce } from '../crypto';
import { createHash } from 'crypto';

/** Ground-truth: Node.js built-in SHA-256 (OpenSSL). */
function nodeSha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

// ─── sha256 ──────────────────────────────────────────────────────────────────

describe('sha256', () => {
  // Validate against Node.js built-in crypto (OpenSSL) — the platform standard.
  it('matches Node.js crypto for the empty string', () => {
    expect(sha256('')).toBe(nodeSha256(''));
  });

  it('matches Node.js crypto for "abc"', () => {
    expect(sha256('abc')).toBe(nodeSha256('abc'));
  });

  it('matches Node.js crypto for "hello"', () => {
    expect(sha256('hello')).toBe(nodeSha256('hello'));
  });

  it('always produces exactly 64 hex characters', () => {
    const inputs = ['', 'a', 'abc', 'hello world', 'TEFPrep Pro nonce test'];
    for (const input of inputs) {
      const result = sha256(input);
      expect(result).toHaveLength(64);
      expect(result).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it('is deterministic — same input always produces the same output', () => {
    const input = 'same-input-every-time';
    expect(sha256(input)).toBe(sha256(input));
    expect(sha256(input)).toBe(sha256(input));
  });

  it('produces different hashes for different inputs', () => {
    expect(sha256('apple')).not.toBe(sha256('Apple'));
    expect(sha256('nonce1')).not.toBe(sha256('nonce2'));
  });

  it('handles inputs longer than 55 bytes (crosses SHA-256 block boundary)', () => {
    // 56+ bytes forces a second padding block — tests the block-loop logic
    const longInput = 'A'.repeat(56);
    const result = sha256(longInput);
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it('handles UTF-8 multi-byte characters', () => {
    // French accents used throughout the app
    const result = sha256('Bonjour Ã©tudiants');
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]{64}$/);
    // Different from ASCII equivalent
    expect(sha256('Bonjour etudiants')).not.toBe(result);
  });
});

// ─── generateNonce ────────────────────────────────────────────────────────────

describe('generateNonce', () => {
  it('returns a string of the requested length', () => {
    expect(generateNonce(32)).toHaveLength(32);
    expect(generateNonce(16)).toHaveLength(16);
    expect(generateNonce(64)).toHaveLength(64);
  });

  it('defaults to 32 characters', () => {
    expect(generateNonce()).toHaveLength(32);
  });

  it('only contains alphanumeric characters', () => {
    const nonce = generateNonce(128);
    expect(nonce).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('produces different values on each call (probabilistic)', () => {
    // Chance of collision in 32-char alphanumeric space is astronomically small
    const nonces = new Set(Array.from({ length: 20 }, () => generateNonce(32)));
    expect(nonces.size).toBe(20);
  });

  it('produces a nonce that can be hashed by sha256', () => {
    const nonce = generateNonce(32);
    const hashed = sha256(nonce);
    expect(hashed).toHaveLength(64);
    expect(hashed).toMatch(/^[0-9a-f]{64}$/);
  });
});
