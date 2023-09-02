import { Router } from "express";
import { getSite } from "../controller/site.controller.js"
import { getLog } from "../controller/log.controller.js";

export const router = Router();

router.get('/site/:id', getSite);
router.get('/site/:id/log', getLog);
