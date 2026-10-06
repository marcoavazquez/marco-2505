const ALGORITHM = "pbkdf2-sha256";
const ITERATIONS = 600_000;
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const SALT_BYTES = new Uint8Array(SALT_LENGTH);

const toHex = (bytes: Uint8Array | ArrayBuffer) =>
  Array.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

const fromHex = (hex: string): Uint8Array<ArrayBuffer> | null =>
  hex.length % 2 === 0 && /^[0-9a-f]*$/.test(hex)
    ? Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => parseInt(byte, 16))
    : null;

const derive = async (
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number
) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const digest = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    KEY_LENGTH
  );

  return toHex(digest);
};

const equals = (left: string, right: string) => {
  if (left.length !== right.length) return false;

  let diff = 0;

  for (let i = 0; i < left.length; i++) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }

  return diff === 0;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(SALT_BYTES);

  const digest = await derive(password, salt, ITERATIONS);

  return [ALGORITHM, ITERATIONS, toHex(salt), digest].join("$");
};

export const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  const [algorithm, rawIterations, saltHex, digest] = (storedHash ?? "").split("$");

  if (algorithm !== ALGORITHM || !saltHex || !digest) return false;

  const iterations = Number(rawIterations);

  if (!Number.isSafeInteger(iterations) || iterations <= 0) return false;

  const salt = fromHex(saltHex);

  if (!salt?.length) return false;

  return equals(await derive(password, salt, iterations), digest);
};