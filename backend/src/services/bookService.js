import { Book, Author, BookAuthor } from "../models/index.js";
import { Op } from "sequelize";

export const getAllBooks = async ({ search, availability }) => {
    const where = {};

    if (search) {
        where[Op.or] = [
            {
                title: {
                    [Op.iLike]: `%${search}%`,
                },
            },
            {
                isbn: {
                    [Op.iLike]: `%${search}%`,
                },
            },
            {
                category: {
                    [Op.iLike]: `%${search}%`,
                },
            },
        ];
    }

    if (availability) {
        if (!["available", "unavailable"].includes(availability)) {
            const error = new Error("Availability must be either available or unavailable");

            error.statusCode = 400;
            throw error;
        }

        if (availability === "available") {
            where.availableCopies = {
                [Op.gt]: 0,
            };
        }

        if (availability === "unavailable") {
            where.availableCopies = 0;
        }
    }

    const books = await Book.findAll({
        where,
        order: [["createdAt", "DESC"]],
    });

    return books;
};

export const getBookById = async (bookId) => {
    const book = await Book.findByPk(bookId, {
        include: [
            {
                model: Author,
                as: "authors",
                attributes: ["id", "name", "bio"],
                through: {
                    attributes: [],
                },
            },
        ],
    });

    if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    return book;
};

export const createBook = async ({ title, isbn, description, category, totalCopies, publishedYear }) => {
    const existingBook = await Book.findOne({
        where: { isbn },
    });

    if (existingBook) {
        const error = new Error("A book with this ISBN already exists");
        error.statusCode = 409;
        throw error;
    }

    if (totalCopies < 1) {
        const error = new Error("Total copies must be at least 1");
        error.statusCode = 400;
        throw error;
    }

    const book = await Book.create({
        title,
        isbn,
        description,
        category,
        totalCopies,
        availableCopies: totalCopies,
        publishedYear,
    });

    return book;
};

export const updateBook = async (bookId, { title, isbn, description, category, totalCopies, publishedYear }) => {
    const book = await Book.findByPk(bookId);

    if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    if (isbn !== book.isbn) {
        const existingBook = await Book.findOne({
            where: { isbn },
        });

        if (existingBook) {
            const error = new Error("A book with this ISBN already exists");
            error.statusCode = 409;
            throw error;
        }
    }

    if (totalCopies < 1) {
        const error = new Error("Total copies must be at least 1");
        error.statusCode = 400;
        throw error;
    }

    const borrowedCopies = book.totalCopies - book.availableCopies;

    if (totalCopies < borrowedCopies) {
        const error = new Error(`Total copies cannot be less than borrowed copies (${borrowedCopies})`);
        error.statusCode = 400;
        throw error;
    }

    const availableCopies = totalCopies - borrowedCopies;

    await book.update({
        title,
        isbn,
        description,
        category,
        totalCopies,
        availableCopies,
        publishedYear,
    });

    return book;
};

export const deleteBook = async (bookId) => {
    const book = await Book.findByPk(bookId);

    if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    await book.destroy();

    return {
        id: bookId,
    };
};

export const assignAuthorToBook = async (bookId, authorId) => {
    const book = await Book.findByPk(bookId);

    if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    const author = await Author.findByPk(authorId);

    if (!author) {
        const error = new Error("Author not found");
        error.statusCode = 404;
        throw error;
    }

    const existingAssignment = await BookAuthor.findOne({
        where: {
            bookId,
            authorId,
        },
    });

    if (existingAssignment) {
        const error = new Error("Author is already assigned to this book");
        error.statusCode = 409;
        throw error;
    }

    await BookAuthor.create({
        bookId,
        authorId,
    });

    return {
        bookId,
        authorId,
    };
};