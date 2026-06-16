(function () {
  const DB_NAME = 'osgb-offline-db';
  const DB_VERSION = 1;
  const STORE_NAME = 'pending_risks';

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'local_id' });
          store.createIndex('sync_status', 'sync_status', { unique: false });
          store.createIndex('created_at', 'created_at', { unique: false });
        }
      };

      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  async function withStore(mode, callback) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const result = callback(store);
      tx.oncomplete = function () { resolve(result); };
      tx.onerror = function () { reject(tx.error); };
      tx.onabort = function () { reject(tx.error); };
    });
  }

  async function saveRisk(risk) {
    return withStore('readwrite', (store) => store.put(risk));
  }

  async function updateRisk(localId, patch) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(localId);

      getRequest.onsuccess = function () {
        const existing = getRequest.result;
        if (!existing) { resolve(false); return; }
        store.put(Object.assign({}, existing, patch));
      };

      tx.oncomplete = function () { resolve(true); };
      tx.onerror = function () { reject(tx.error); };
    });
  }

  async function getAllRisks() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = function () { resolve(request.result || []); };
      request.onerror = function () { reject(request.error); };
    });
  }

  async function getPendingRisks() {
    const all = await getAllRisks();
    return all.filter((item) => item.sync_status === 'pending' || item.sync_status === 'error');
  }

  async function countPendingRisks() {
    const pending = await getPendingRisks();
    return pending.length;
  }

  window.OSGBOfflineDB = {
    saveRisk,
    updateRisk,
    getAllRisks,
    getPendingRisks,
    countPendingRisks
  };
})();
