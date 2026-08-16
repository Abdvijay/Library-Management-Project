import { Author, Book } from "../models/index.js";

export const getAllAuthors = async () => {
  const authors = await Author.findAll({
    order: [["createdAt", "DESC"]],
  });

  return authors;
};

export const getAuthorById = async (authorId) => {
  const author = await Author.findByPk(authorId);

  if (!author) {
    const error = new Error("Author not found");
    error.statusCode = 404;
    throw error;
  }

  return author;
};

export const createAuthor = async ({ name, bio }) => {
  const existingAuthor = await Author.findOne({
    where: { name },
  });

  if (existingAuthor) {
    const error = new Error("An author with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  const author = await Author.create({
    name,
    bio,
  });

  return author;
};

export const updateAuthor = async (authorId, { name, bio }) => {
  const author = await Author.findByPk(authorId);

  if (!author) {
    const error = new Error("Author not found");
    error.statusCode = 404;
    throw error;
  }

  const existingAuthor = await Author.findOne({
    where: { name },
  });

  if (existingAuthor && existingAuthor.id !== author.id) {
    const error = new Error("An author with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  await author.update({
    name,
    bio,
  });

  return author;
};

export const deleteAuthor = async (authorId) => {
  const author = await Author.findByPk(authorId);

  if (!author) {
    const error = new Error("Author not found");
    error.statusCode = 404;
    throw error;
  }

  await author.destroy();

  return {
    id: authorId,
  };
};

export const getAuthorBooks = async (authorId) => {
  const author = await Author.findByPk(authorId);

  if (!author) {
    const error = new Error("Author not found");
    error.statusCode = 404;
    throw error;
  }

  const books = await Book.findAll({
    include: [
      {
        model: Author,
        as: "authors",
        where: {
          id: authorId,
        },
        attributes: [],
        through: {
          attributes: [],
        },
      },
    ],
    attributes: [
      "id",
      "title",
      "isbn",
      "category",
      "totalCopies",
      "availableCopies",
      "publishedYear",
    ],
    order: [["title", "ASC"]],
  });

  return books;
};