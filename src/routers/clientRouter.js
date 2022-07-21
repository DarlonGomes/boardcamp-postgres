import { Router } from "express";
import { getCustomer, getCustomerById, postCustomer, updateCustomer } from "../controllers/clientController.js";
const router = Router();

router.get('/customers', getCustomer);
router.get('/customers/:id', getCustomerById);
router.post('/customers', postCustomer);
router.put('/customers/:id', updateCustomer);

export default router;