import { Response, Request, Router } from "express";
import csvParser from "csv-parser";
import multer from "multer";
import { Readable } from "stream";
import { getMongoInstance, getTransactionCollection } from "../database";
import { Transaction } from "../interfaces";
import { formatTransactionValues, validateDocument, validatePayment } from "../utils";

const csvRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

csvRouter.post('/upload', upload.single('csv'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(404).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const db = await getMongoInstance();
    const transactionCollection = getTransactionCollection(db);
    const csvFile = req.file;

    const readStream = Readable.from(csvFile.buffer.toString());

    readStream
      .pipe(csvParser())
      .on('data',async  (row: Transaction) => {
        let transaction = formatTransactionValues(row);
        transaction = {
          ...transaction,
          isDocumentValid: validateDocument(transaction.nrCpfCnpj),
          isPaymentOk: validatePayment({ ...row, dtContrato: transaction.dtContrato })
        }
        await transactionCollection.insertOne(transaction);
      })
      .on('end', async () => {
        const transactions = await transactionCollection.find({}).toArray();
        return res.status(201).json({ transactions });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
});

csvRouter.get('/', async (req: Request, res: Response) => {
  const db = await getMongoInstance();
  const transactionCollection = getTransactionCollection(db);
  const transactions = await transactionCollection.find({}).toArray();
  return res.status(200).json({ transactions });
})

export { csvRouter };
