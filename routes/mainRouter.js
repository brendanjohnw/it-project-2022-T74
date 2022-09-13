import express from "express";
import { getIndex } from "../controllers/mainController.js";

export const mainRouter = express.Router();

mainRouter.get("/", getIndex);
