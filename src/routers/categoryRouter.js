import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categoryController.js";
import { categoryValidation } from "../middleware/joiMiddleware.js";
import clearData from '../middleware/stripMiddleware.js'
const router = Router();

router.get('/categories', getCategories);
router.post('/categories', clearData, categoryValidation, postCategories);

export default router;