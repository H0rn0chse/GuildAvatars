const databaseName = "guild-avatars-personalization";
const objectKey = "0";
const storeName = "Store";

export async function getPersonalizationValue (key) {
  const data = await getPersonalization();
  return data[key];
}

export async function setPersonalizationValue (key, value) {
  const data = await getPersonalization();
  data[key] = value;
  await setPersonalization(data);
}

const defaultPers = {
  id: objectKey,
  version: "1.0.0"
};
async function getPersonalization () {
  const { store } = await getDB();

  return new Promise((resolve, reject) => {
    const getData = store.get(objectKey);
    getData.onsuccess = () => {
      const data = getData.result || defaultPers;
      resolve(data);
    };
    getData.onerror = () => {
      resolve(defaultPers);
    };
  });
}

async function setPersonalization (data) {
  const { store } = await getDB();
  store.put(data);
}

function getDB () {
  // todo use lib for indexed db access
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(databaseName, 1);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(storeName, "readwrite");
      tx.oncomplete = () => {
        db.close();
      };
      const store = tx.objectStore(storeName);
      resolve({ db, tx, store });
    };
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore(storeName, { keyPath: "id" });
    };
    open.onerror = () => {
      reject();
    };
  });
}
