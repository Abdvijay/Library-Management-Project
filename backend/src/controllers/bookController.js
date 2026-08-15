import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../services/bookService.js";

export const getBooks = async (request, reply) => {
    try {
        const books = await getAllBooks();

        return reply.code(200).send({
            success: true,
            data: books,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(500).send({
            success: false,
            message: "Unable to fetch books",
        });
    }
};

export const getBook = async (request, reply) => {
    try {
        const { id } = request.params;

        const book = await getBookById(id);

        return reply.code(200).send({
            success: true,
            data: book,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to fetch book",
        });
    }
};

export const createBookController = async (request, reply) => {
    try {
        const { title, isbn, description, category, totalCopies, publishedYear } = request.body;

        if (!title || !isbn || !category || totalCopies === undefined) {
            return reply.code(400).send({
                success: false,
                message: "Title, ISBN, category and total copies are required",
            });
        }

        const book = await createBook({
            title,
            isbn,
            description,
            category,
            totalCopies: Number(totalCopies),
            publishedYear,
        });

        return reply.code(201).send({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to create book",
        });
    }
};

export const updateBookController = async (request, reply) => {
    try {
        const { id } = request.params;

        const { title, isbn, description, category, totalCopies, publishedYear } = request.body;

        if (!title || !isbn || !category || totalCopies === undefined) {
            return reply.code(400).send({
                success: false,
                message: "Title, ISBN, category and total copies are required",
            });
        }

        const book = await updateBook(id, {
            title,
            isbn,
            description,
            category,
            totalCopies: Number(totalCopies),
            publishedYear,
        });

        return reply.code(200).send({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to update book",
        });
    }
};

export const deleteBookController = async (request, reply) => {
    try {
        const { id } = request.params;

        await deleteBook(id);

        return reply.code(200).send({
            success: true,
            message: "Book deleted successfully",
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to delete book",
        });
    }
};