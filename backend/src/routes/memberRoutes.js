import { getMembers, getMember, getMemberIssuesController } from "../controllers/memberController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const memberRoutes = async (app) => {
    app.get(
        "/",
        {
            preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],
        },
        getMembers
    );

    app.get(
        "/:id",
        {
            preHandler: authMiddleware,
        },
        getMember
    );

    app.get(
        "/:id/issues",
        {
            preHandler: authMiddleware,
        },
        getMemberIssuesController
    );
};

export default memberRoutes;