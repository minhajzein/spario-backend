import { Router } from "express";
import { createTransaction, getTransactionsByExecutive } from "../../controllers/executive/transactionsController.mjs";
import { getStoresByExecutive } from "../../controllers/admin/storeController.mjs";

const router = Router()

// Transactions =========================================================================================================
router.post('/transactions', createTransaction)
router.get('/transactions/:id', getTransactionsByExecutive)


// Stores ===============================================================================================================
router.get('/stores/:id', getStoresByExecutive)

export default router