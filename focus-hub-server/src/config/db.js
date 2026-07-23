import { MongoClient, ServerApiVersion } from "mongodb";
import config from "./env.js";

const uri = `mongodb+srv://${config.db_user}:${config.db_pass}@cluster0.g8eto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = config.DB_DEV;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
let dbPromise;

export const dbConnect = async () => {
  try {
    if (db) {
      return db;
    }

    if (!dbPromise) {
      dbPromise = client.connect();
    }

    await dbPromise;

    db = client.db("focusHub");

    console.log("MongoDB connected");

    return db;
  } catch (err) {
    console.error(err);
  }
};

export const getDB = async () => {
  if (!db) {
    // throw new Error("Database not initialized");
    await dbConnect()
  }
  return db;
};

export const getCollection = async (name) => {

  const database = await getDB();

  return database.collection(name);
};