import { getMembers, getMember, getMemberIssuesController, createMemberController, updateMemberController, deleteMemberController } from "../controllers/memberController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const memberRoutes = async (app) => {

    app.post(
      "/",
      {
        preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],
      },
      createMemberController,
    );

    app.put(
        "/:id",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(["LIBRARIAN"]),
            ],
        },
        updateMemberController
    );

    app.delete(
        "/:id",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(["LIBRARIAN"]),
            ],
        },
        deleteMemberController
    );

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