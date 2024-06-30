import * as bcrypt from 'bcrypt';

export function hashValue(value: string, salt: number) {
  if (value) {
    return bcrypt.hash(value, salt);
  }
}

export function verifyHash(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}
