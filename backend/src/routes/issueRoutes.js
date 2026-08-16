import { createIssueController, getIssues, getIssue, returnBookController } from "../controllers/issueController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const issueRoutes = async (app) => {
    app.post(
        "/",
        {
            preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],
        },
        createIssueController
    );

    app.get(
        "/",
        {
            preHandler: authMiddleware,
        },
        getIssues
    );

    app.get(
        "/:id",
        {
            preHandler: authMiddleware,
        },
        getIssue
    );

    app.put(
        "/:id/return",
        {
            preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],
        },
        returnBookController
    );
};

export default issueRoutes;