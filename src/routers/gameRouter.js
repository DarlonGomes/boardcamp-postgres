import { Router } from "express";
import { getGames, postGames } from "../controllers/gameController.js";
import { gameValidation } from "../middleware/joiMiddleware.js";
import clearData from '../middleware/stripMiddleware.js'
const router = Router();

router.get('/games', getGames);
router.post('/games',clearData, gameValidation, postGames);

export default router;