import { getDashboardStatsController } from "../controllers/dashboardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const dashboardRoutes = async (app) => {
    app.get(
        "/",
        {
            preHandler: authMiddleware,
        },
        getDashboardStatsController
    );
};

export default dashboardRoutes;