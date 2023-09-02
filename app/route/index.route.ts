import { Router } from "express";
import { getIndex } from "../controller/index.controller.js";

export const router = Router();

router.get('/', getIndex);
