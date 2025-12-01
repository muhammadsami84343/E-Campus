// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Only initialize MongoDB if URI is available (skip during build if not set)
if (uri) {
  // In dev, use a global to preserve value across HMR reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }
  if (!clientPromise) {
    throw new Error("MongoDB client not initialized");
  }
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB;
  if (!dbName) {
    throw new Error("Missing MONGODB_DB environment variable");
  }
  return client.db(dbName);
}
