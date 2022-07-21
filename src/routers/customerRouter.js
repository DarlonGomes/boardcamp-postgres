import { Router } from "express";
import { getCustomer, postCustomer, updateCustomer } from "../controllers/customerController.js";
import { customerValidation} from '../middleware/joiMiddleware.js'
import clearData from '../middleware/stripMiddleware.js'
const router = Router();

router.get('/customers', getCustomer);
router.get('/customers/:id', getCustomer);
router.post('/customers', clearData, customerValidation, postCustomer);
router.put('/customers/:id',clearData, customerValidation, updateCustomer);

export default router;