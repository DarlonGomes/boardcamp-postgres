import { Router } from "express";
import {getRentals, postRentals, finishRentals, deleteRentals} from '../controllers/rentController.js'
import { rentalValidation} from '../middleware/joiMiddleware.js'
import clearData from '../middleware/stripMiddleware.js'
const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals',clearData, rentalValidation, postRentals);
router.post('/rentals/:id/return',clearData, rentalValidation, finishRentals);
router.delete('/rentals/:id', deleteRentals);

export default router;