import { getBooks, getBook, createBookController, updateBookController, deleteBookController,
    assignAuthorController, removeAuthorFromBookController
} from "../controllers/bookController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const bookRoutes = async (app) => {
    app.get("/",{ preHandler: authMiddleware,},getBooks);
    app.get("/:id",{ preHandler: authMiddleware,},getBook);
    app.post("/",{ 
        preHandler: [
            authMiddleware, 
            roleMiddleware(["LIBRARIAN"]),
        ]}, 
        createBookController
    );
    app.put("/:id",{ 
        preHandler: [
            authMiddleware, 
            roleMiddleware(["LIBRARIAN"]),
        ]}, 
        updateBookController
    );
    app.delete(
        "/:bookId/authors/:authorId",
        {
            preHandler: [authMiddleware, roleMiddleware(["LIBRARIAN"])],
        },
        removeAuthorFromBookController
    );
    app.delete("/:id",{ 
        preHandler: [
            authMiddleware, 
            roleMiddleware(["LIBRARIAN"]),
        ]}, 
        deleteBookController
    );
    app.post("/:bookId/authors/:authorId",{
        preHandler: [
            authMiddleware, 
            roleMiddleware(["LIBRARIAN"])
        ],},
        assignAuthorController
    );
};

export default bookRoutes;