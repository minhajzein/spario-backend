import { Router } from "express";
import { createTransaction, getTransactionsByExecutive, getTransactionsByStore } from "../../controllers/executive/transactionsController.mjs";
import { getStoresByExecutive } from "../../controllers/admin/storeController.mjs";
import { getDashboard } from "../../controllers/executive/dashboardController.mjs";

const router = Router()

// Dashboard ============================================================================================================
router.get('/dashboard/:id', getDashboard)

// Transactions =========================================================================================================
router.post('/transactions', createTransaction)
router.get('/transactions/:id', getTransactionsByExecutive)
router.get('/transactions/store/:id', getTransactionsByStore)

// Stores ===============================================================================================================
router.get('/stores/:id', getStoresByExecutive)

export default router