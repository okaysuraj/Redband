import * as SecureStore from "expo-secure-store";

// Firebase accepts an AsyncStorage-shaped adapter. Session JSON is split so each
// encrypted item stays below platform limits; a manifest commits each write.
const CHUNK_SIZE = 1500;
const MAX_CHUNKS = 32;
let queue = Promise.resolve();
const serialized = (operation) => {
  const pending = queue.then(operation, operation);
  queue = pending.catch(() => {});
  return pending;
};
const storageKey = (key) =>
  `fb.${Array.from(key, (char) => char.codePointAt(0).toString(16).padStart(4, "0")).join("")}`;
const options = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};
function chunkUtf8(value) {
  const chunks = [];
  let chunk = "";
  let size = 0;
  for (const character of value) {
    const point = character.codePointAt(0);
    const bytes =
      point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4;
    if (size + bytes > CHUNK_SIZE) {
      chunks.push(chunk);
      chunk = "";
      size = 0;
    }
    chunk += character;
    size += bytes;
  }
  chunks.push(chunk);
  return chunks;
}
async function readManifest(base) {
  const raw = await SecureStore.getItemAsync(`${base}.manifest`);
  if (!raw) return null;
  try {
    const manifest = JSON.parse(raw);
    if (
      typeof manifest.generation !== "string" ||
      !/^[a-z0-9]+$/.test(manifest.generation) ||
      !Number.isInteger(manifest.count) ||
      manifest.count < 1 ||
      manifest.count > MAX_CHUNKS
    )
      return null;
    return manifest;
  } catch {
    return null;
  }
}
async function removeChunks(base, manifest) {
  if (!manifest) return;
  await Promise.all(
    Array.from({ length: manifest.count }, (_, index) =>
      SecureStore.deleteItemAsync(`${base}.${manifest.generation}.${index}`),
    ),
  );
}

export const securePersistence = {
  getItem: (key) =>
    serialized(async () => {
      const base = storageKey(key);
      const manifest = await readManifest(base);
      if (!manifest) return null;
      const parts = await Promise.all(
        Array.from({ length: manifest.count }, (_, index) =>
          SecureStore.getItemAsync(`${base}.${manifest.generation}.${index}`),
        ),
      );
      return parts.some((part) => part === null) ? null : parts.join("");
    }),
  setItem: (key, value) =>
    serialized(async () => {
      const base = storageKey(key);
      const chunks = chunkUtf8(value);
      const count = chunks.length;
      if (count > MAX_CHUNKS)
        throw new Error("Session exceeds secure storage limits.");
      const previous = await readManifest(base);
      const manifest = {
        generation: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`,
        count,
      };
      try {
        await Promise.all(
          chunks.map((chunk, index) =>
            SecureStore.setItemAsync(
              `${base}.${manifest.generation}.${index}`,
              chunk,
              options,
            ),
          ),
        );
        await SecureStore.setItemAsync(
          `${base}.manifest`,
          JSON.stringify(manifest),
          options,
        );
      } catch (error) {
        await removeChunks(base, manifest).catch(() => {});
        throw error;
      }
      await removeChunks(base, previous).catch(() => {});
    }),
  removeItem: (key) =>
    serialized(async () => {
      const base = storageKey(key);
      const manifest = await readManifest(base);
      await SecureStore.deleteItemAsync(`${base}.manifest`);
      await removeChunks(base, manifest);
    }),
};
