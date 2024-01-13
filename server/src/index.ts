import express, { Express, json } from "express";
import cors from 'cors';
import { router } from "./routes";
import { getMongoInstance } from "./database";

const app: Express = express();
const port = 8080;

app.use(cors());
app.use(json());
app.use(router);

app.listen(port, async () => {
  await getMongoInstance();
  console.log(`Server is running at http://localhost:${port}`);
});
