import { openDB, DBSchema } from 'idb';

interface OracleDBSchema extends DBSchema {
  grimoire: {
    key: string;
    value: any;
  };
  study_progress: {
    key: string;
    value: any;
  };
  sync_queue: {
    key: string;
    value: {
      type: string;
      payload: any;
      timestamp: number;
    };
    indexes: { 'timestamp': number };
  };
}

let dbPromise: Promise<any>;

export function initDB() {
  if (typeof window === 'undefined') return;
  if (!dbPromise) {
    dbPromise = openDB<OracleDBSchema>('oracle-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('grimoire')) {
          db.createObjectStore('grimoire', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('study_progress')) {
          db.createObjectStore('study_progress', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveGrimoireEntryLocal(entry: any) {
  const db = await initDB();
  if (db) await db.put('grimoire', entry);
}

export async function getAllGrimoireEntriesLocal() {
  const db = await initDB();
  if (db) return db.getAll('grimoire');
  return [];
}

export async function saveStudyProgressLocal(progress: any) {
  const db = await initDB();
  if (db) await db.put('study_progress', progress);
}

export async function getStudyProgressLocal() {
  const db = await initDB();
  if (db) return db.getAll('study_progress');
  return [];
}

export async function addToSyncQueue(type: string, payload: any) {
  const db = await initDB();
  if (db) {
    await db.add('sync_queue', {
      type,
      payload,
      timestamp: Date.now()
    });
  }
}

export async function getSyncQueue() {
  const db = await initDB();
  if (db) return db.getAll('sync_queue');
  return [];
}

export async function clearSyncQueueItem(id: number) {
  const db = await initDB();
  if (db) {
    await db.delete('sync_queue', id);
  }
}
