import express from "express";

import { authenticate } from "../middlewares/authMiddleware";
import { getAllFomulas } from "../controllers/formulaController";

const router = express.Router();

router.get("/", authenticate, getAllFomulas);

export default router;
