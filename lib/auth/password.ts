import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

function deriveKey(password: string, salt: string, keyLength = KEY_LENGTH) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await deriveKey(password, salt);

  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hashHex, ...extraParts] = storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !salt ||
    !hashHex ||
    extraParts.length > 0 ||
    !/^[\da-f]+$/i.test(hashHex)
  ) {
    return false;
  }

  const expectedHash = Buffer.from(hashHex, "hex");

  if (expectedHash.length !== KEY_LENGTH) {
    return false;
  }

  const actualHash = await deriveKey(password, salt, expectedHash.length);
  return timingSafeEqual(actualHash, expectedHash);
}
