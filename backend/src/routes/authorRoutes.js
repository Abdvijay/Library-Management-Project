import { getAuthors, getAuthor, createAuthorController, updateAuthorController, deleteAuthorController } from "../controllers/authorController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const authorRoutes = async (app) => {
    app.get("/",{preHandler: authMiddleware,},getAuthors);
    app.get("/:id",{preHandler: authMiddleware,},getAuthor);
    app.post("/",{preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],},createAuthorController);
    app.put("/:id",{preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],},updateAuthorController);
    app.delete("/:id",{preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],},deleteAuthorController);
};

export default authorRoutes;