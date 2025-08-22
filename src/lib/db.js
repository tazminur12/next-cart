import clientPromise from './mongodb-adapter';

const DB_NAME = process.env.DB_NAME || 'products_app';

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
