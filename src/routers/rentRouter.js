import { Router } from "express";
import {getRentals, openRentals, finishRentals, deleteRentals, getMetrics} from '../controllers/rentController.js'
import { returnValidation, openRentalValidation} from '../middleware/joiMiddleware.js'
import clearData from '../middleware/stripMiddleware.js'
const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals',clearData, openRentalValidation, openRentals);
router.post('/rentals/:id/return', returnValidation, finishRentals);
router.delete('/rentals/:id', deleteRentals);
router.get('/rentals/metrics', getMetrics);

export default router;