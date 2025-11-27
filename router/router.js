import express from "express";
import {
  createNamesDocument,
  getNames,
  pickRandomName,
} from "../controller/names.js";

const router = express.Router();

router.post("/init", createNamesDocument);
router.get("/", getNames);
router.post("/pick", pickRandomName);

export default router;
