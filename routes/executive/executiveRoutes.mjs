import { Router } from "express";
import { createTransaction, deleteTransaction, getTransactionsByExecutive, getTransactionsByStore, updateTransaction } from "../../controllers/executive/transactionsController.mjs";
import { getStoresByExecutive } from "../../controllers/admin/storeController.mjs";
import { getDashboard } from "../../controllers/executive/dashboardController.mjs";
import { getInvoices } from "../../controllers/executive/invoiceController.mjs";
import { createReturn, getAllReturns, getReturnsByExecutive } from "../../controllers/executive/returnController.mjs";

const router = Router()

// Dashboard ============================================================================================================
router.get('/dashboard/:id', getDashboard)

// Transactions =========================================================================================================
router.post('/transactions', createTransaction)
router.get('/transactions/:id', getTransactionsByExecutive)
router.get('/transactions/store/:id', getTransactionsByStore)
router.put('/transactions/:id', updateTransaction)
router.delete('/transactions/:id', deleteTransaction)

// Stores ===============================================================================================================
router.get('/stores/:id', getStoresByExecutive)

// Invoices =============================================================================================================
router.get('/invoices/:id', getInvoices)

// Returns ===============================================================================================================
router.get('/returns', getAllReturns)
router.get('/returns/:id', getReturnsByExecutive)
router.post('/returns', createReturn)

export default router