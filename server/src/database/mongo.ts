import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'kronoos';

let cachedDb: Db | null = null;

const connectToMongoDB = async (): Promise<Db> => {
  try {
    if (cachedDb) return cachedDb;

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    console.log('Conexão com o MongoDB estabelecida com sucesso');

    db.collection('transactions').createIndex({ "$**": "text" });
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};

export async function getMongoInstance() {
  if (cachedDb) return cachedDb;
  return await connectToMongoDB();
}