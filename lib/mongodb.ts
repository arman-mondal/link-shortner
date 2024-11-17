import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Use a global variable to ensure the client is reused during hot-reloading
  if (!(global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise = client.connect();
  }
  clientPromise = (global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise || Promise.reject(new Error('MongoClient promise is undefined'));
} else {
  // Create a new client for production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const getDatabase = async (dbName: string): Promise<Db> => {
  const client = await clientPromise;
  return client.db(dbName);
};

export default clientPromise;
