import { getAllAuthors, getAuthorById, getAuthorBooks, createAuthor, updateAuthor, deleteAuthor } from "../services/authorService.js";

export const getAuthors = async (request, reply) => {
    try {
        const authors = await getAllAuthors();

        return reply.code(200).send({
            success: true,
            data: authors,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(500).send({
            success: false,
            message: "Unable to fetch authors",
        });
    }
};

export const getAuthor = async (request, reply) => {
    try {
        const { id } = request.params;

        const author = await getAuthorById(id);

        return reply.code(200).send({
            success: true,
            data: author,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to fetch author",
        });
    }
};

export const createAuthorController = async (request, reply) => {
    try {
        const { name, bio } = request.body;

        if (!name || !name.trim()) {
            return reply.code(400).send({
                success: false,
                message: "Author name is required",
            });
        }

        const author = await createAuthor({
            name: name.trim(),
            bio: bio?.trim() || null,
        });

        return reply.code(201).send({
            success: true,
            message: "Author created successfully",
            data: author,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to create author",
        });
    }
};

export const updateAuthorController = async (request, reply) => {
    try {
        const { id } = request.params;
        const { name, bio } = request.body;

        if (!name || !name.trim()) {
            return reply.code(400).send({
                success: false,
                message: "Author name is required",
            });
        }

        const author = await updateAuthor(id, {
            name: name.trim(),
            bio: bio?.trim() || null,
        });

        return reply.code(200).send({
            success: true,
            message: "Author updated successfully",
            data: author,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to update author",
        });
    }
};

export const deleteAuthorController = async (request, reply) => {
    try {
        const { id } = request.params;

        await deleteAuthor(id);

        return reply.code(200).send({
            success: true,
            message: "Author deleted successfully",
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to delete author",
        });
    }
};

export const getAuthorBooksController = async (request, reply) => {
    try {
        const { id } = request.params;

        const books = await getAuthorBooks(id);

        return reply.code(200).send({
            success: true,
            data: books,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to fetch author books",
        });
    }
};