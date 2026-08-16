import { getDashboard } from "../controllers/dashboardController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const dashboardRoutes = async (app) => {
    app.get(
        "/",
        {
            preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],
        },
        getDashboard
    );
};

export default dashboardRoutes;