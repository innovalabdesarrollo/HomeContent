import { MongoClient, type Db } from "mongodb";
import { config as loadEnv } from "dotenv";
import path from "node:path";

// Local: carga .env del monorepo. En Vercel las vars ya vienen del dashboard.
loadEnv({ path: path.resolve(process.cwd(), "../../.env") });
loadEnv({ path: path.resolve(process.cwd(), ".env") });

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI no definida");
  return uri;
}

function getDbName(uri: string) {
  const fromUri = uri.match(/\.net\/([^?]+)/)?.[1];
  return fromUri && fromUri !== "" ? fromUri : "homecontent";
}

function getClientPromise() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(getUri());
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const uri = getUri();
  const client = await getClientPromise();
  return client.db(getDbName(uri));
}
