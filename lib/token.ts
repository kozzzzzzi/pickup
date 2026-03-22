import crypto from "crypto";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateToken(length = 16) {
  const bytes = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }

  return result;
}