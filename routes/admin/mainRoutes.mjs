import { Router } from "express";
import { getDashboard } from "../../controllers/admin/dashboardController.mjs";
import { createStore, deleteStore, getAllStores, updateStore } from "../../controllers/admin/storeController.mjs";
import { changeStatusExecutive, createExecutive, deleteExecutive, getAllExecutives, getAllExecutivesByRoute, getExecutiveById, updateExecutive } from "../../controllers/admin/executiveController.mjs";
import { createRoute, getAllRoutes } from "../../controllers/admin/routeController.mjs";
import { createInvoice, deleteInvoice, getInvoices, updateInvoice } from "../../controllers/admin/invoiceController.mjs";
import { getAllTransactions } from "../../controllers/executive/transactionsController.mjs";

const router = Router()

router.get('/', getDashboard)

// stores ==============================================================================================================
router.route('/stores')
    .get(getAllStores)
    .post(createStore);

router.route('/stores/:id')
    .put(updateStore)
    .delete(deleteStore);

// executives ==============================================================================================================
router.route('/executives')
    .get(getAllExecutives)
    .post(createExecutive)

router.route('/executives/:id')
    .get(getExecutiveById)
    .put(updateExecutive)
    .delete(deleteExecutive)
    .patch(changeStatusExecutive)

router.get('/executive/:route', getAllExecutivesByRoute)

// routes ==============================================================================================================
router.route('/routes')
    .get(getAllRoutes)
    .post(createRoute)

// invoices ==============================================================================================================
router.route('/invoices')
    .get(getInvoices)
    .post(createInvoice)

router.route('/invoices/:id')
    .put(updateInvoice)
    .delete(deleteInvoice)

// transactions ==============================================================================================================
router.route('/transactions')
    .get(getAllTransactions)




export default router