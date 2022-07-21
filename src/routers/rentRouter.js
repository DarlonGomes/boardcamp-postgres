import { Router } from "express";
import {getRentals, postRentals, finishRentals, deleteRentals} from '../controllers/rentController.js'
import { rentalValidation} from '../middleware/joiMiddleware.js'
import clearData from '../middleware/stripMiddleware.js'
const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', postRentals);
router.post('/rentals/:id/return', finishRentals);
router.delete('/rentals/:id', deleteRentals);
export default router;