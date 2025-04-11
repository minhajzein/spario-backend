import { Router } from "express";
import { getDashboard } from "../../controllers/admin/dashboardController.mjs";
import { createStore, deleteStore, getAllStores, updateStore } from "../../controllers/admin/storeController.mjs";
import { createExecutive, deleteExecutive, getAllExecutives, getAllExecutivesByRoute, updateExecutive } from "../../controllers/admin/executiveController.mjs";
import { createRoute, getAllRoutes } from "../../controllers/admin/routeController.mjs";

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
    .put(updateExecutive)
    .delete(deleteExecutive)

router.get('/executive/:route', getAllExecutivesByRoute)

// routes ==============================================================================================================
router.route('/routes')
    .get(getAllRoutes)
    .post(createRoute)



export default router