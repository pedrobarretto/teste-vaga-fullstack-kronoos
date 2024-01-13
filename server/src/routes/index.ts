import { Router } from "express";
import { csvRouter } from "./csv";

const router = Router();

router.use('/data', csvRouter);

export { router };
