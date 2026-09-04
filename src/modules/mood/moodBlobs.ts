// Uploaded mood images are too big for localStorage, so the blobs live in IndexedDB
// and only their metadata goes through the normal store.
const DB_NAME = 'sync-helper';
const STORE = 'moodBlobs';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const req = fn(db.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

export const putBlob = (key: string, blob: Blob): Promise<unknown> => run('readwrite', (s) => s.put(blob, key));
export const deleteBlob = (key: string): Promise<unknown> => run('readwrite', (s) => s.delete(key));
export const allBlobKeys = (): Promise<IDBValidKey[]> => run('readonly', (s) => s.getAllKeys());
export const allBlobs = (): Promise<Blob[]> => run('readonly', (s) => s.getAll());
