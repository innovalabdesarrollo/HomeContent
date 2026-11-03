import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDb(uri) {
  if (db) return db;
  if (!uri) throw new Error("MONGODB_URI no definida");

  client = new MongoClient(uri);
  await client.connect();

  // Nombre de DB desde la URI path; fallback homecontent
  const fromUri = uri.match(/\.net\/([^?]+)/)?.[1];
  const dbName = fromUri && fromUri !== "" ? fromUri : "homecontent";
  db = client.db(dbName);
  return db;
}

export function getDb() {
  if (!db) throw new Error("DB no conectada");
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}
