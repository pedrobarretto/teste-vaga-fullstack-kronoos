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
        const transactions = await transactionCollection.find({}).skip(0).limit(10).toArray();
        const hasNextPage = 0 < (await transactionCollection.countDocuments({}));
        return res.status(201).json({ transactions, hasNextPage });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
});

csvRouter.get('/:page', async (req: Request, res: Response) => {
  try {
    const db = await getMongoInstance();
    const transactionCollection = getTransactionCollection(db);

    const page = parseInt(req.params.page as string, 10) || 1;
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const transactions = await transactionCollection
      .find({})
      .skip(startIndex)
      .limit(itemsPerPage)
      .toArray();

    const hasNextPage = endIndex < (await transactionCollection.countDocuments({}));

    return res.status(200).json({ transactions, hasNextPage });
  } catch (error) {
    console.error('Erro durante a solicitação:', error);
    return res.status(500).json({ error: 'Erro ao retornar paginação' });
  }
});

csvRouter.get('/search/:search/:page', async (req: Request, res: Response) => {
  try {
    const { search } = req.params;

    const db = await getMongoInstance();
    const transactionCollection = getTransactionCollection(db);

    const page = parseInt(req.params.page as string, 10) || 1;
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const searchResult = await transactionCollection
    .find({ $text: { $search: search } })
    .skip(startIndex)
    .limit(itemsPerPage)
    .toArray();

    const hasNextPage = endIndex < (searchResult.length - itemsPerPage);
    
    return res.status(200).json({ transactions: searchResult, hasNextPage });
  } catch (error) {
    console.error('Erro durante a solicitação:', error);
    return res.status(500).json({ error: 'Erro ao retornar pesquisa' });
  }
});


export { csvRouter };
