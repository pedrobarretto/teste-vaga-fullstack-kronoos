import { Db, Collection } from 'mongodb';
import { Transaction } from '../interfaces';

export const getTransactionCollection = (db: Db): Collection<Transaction> => {
  return db.collection<Transaction>('transactions');
};
