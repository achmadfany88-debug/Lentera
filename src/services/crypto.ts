/**
 * Industrial-grade Cryptographic Password Hashing using Web Crypto API (PBKDF2 with SHA-256 and unique salts).
 * Complies with OWASP Password Storage Cheat Sheet standards.
 */

// Generate a cryptographically secure random salt (16 bytes, hex encoded)
export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Convert string to ArrayBuffer
function stringToBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer;
}

// Convert ArrayBuffer to Hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derives a PBKDF2 hash using SHA-256 with 100,000 iterations.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    true,
    ['sign']
  );

  const exported = await window.crypto.subtle.exportKey('raw', derivedKey);
  return bufferToHex(exported);
}

/**
 * Securely verifies a plain password against a stored PBKDF2 hash and salt.
 */
export async function verifyPassword(password: string, salt: string, storedHash: string): Promise<boolean> {
  const computedHash = await hashPassword(password, salt);
  return computedHash.toLowerCase() === storedHash.toLowerCase();
}

/**
 * Calculates password strength indicator (0-100) and feedback.
 */
export function evaluatePasswordStrength(password: string): {
  score: number;
  label: 'Sangat Lemah' | 'Lemah' | 'Cukup' | 'Kuat' | 'Sangat Aman';
  color: string;
} {
  if (!password) return { score: 0, label: 'Sangat Lemah', color: 'bg-slate-300' };

  let score = 0;
  if (password.length >= 6) score += 20;
  if (password.length >= 10) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  if (score < 40) return { score, label: 'Lemah', color: 'bg-rose-500' };
  if (score < 60) return { score, label: 'Cukup', color: 'bg-amber-500' };
  if (score < 80) return { score, label: 'Kuat', color: 'bg-blue-500' };
  return { score, label: 'Sangat Aman', color: 'bg-emerald-500' };
}
