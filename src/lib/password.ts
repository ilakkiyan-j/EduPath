import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LEN = 64;
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 };

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LEN, SCRYPT_OPTS);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [scheme, saltHex, hashHex] = storedHash.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(password, salt, expected.length, SCRYPT_OPTS);

  return timingSafeEqual(actual, expected);
}