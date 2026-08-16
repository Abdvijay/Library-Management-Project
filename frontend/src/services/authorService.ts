import { apiRequest } from "./api";
import type { Author, AuthorBook } from "../types";

export const getAuthors = async () => {
  const response = await apiRequest("/authors");

  return response.data as Author[];
};

export const getAuthorById = async (id: number) => {
  const response = await apiRequest(`/authors/${id}`);

  return response.data as Author;
};

export const createAuthor = async (authorData: {
  name: string;
  bio?: string;
}) => {
  return apiRequest("/authors", {
    method: "POST",
    body: JSON.stringify(authorData),
  });
};

export const updateAuthor = async (
  id: number,
  authorData: {
    name: string;
    bio?: string;
  },
) => {
  return apiRequest(`/authors/${id}`, {
    method: "PUT",
    body: JSON.stringify(authorData),
  });
};

export const deleteAuthor = async (id: number) => {
  return apiRequest(`/authors/${id}`, {
    method: "DELETE",
    body: JSON.stringify({}),
  });
};

export const assignAuthorToBook = async (bookId: number, authorId: number) => {
  return apiRequest(`/books/${bookId}/authors/${authorId}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
};

export const getAuthorBooks = async (id: number) => {
  const response = await apiRequest(`/authors/${id}/books`);

  return response.data as AuthorBook[];
};

export const removeAuthorFromBook = async (
  bookId: number,
  authorId: number,
) => {
  return apiRequest(`/books/${bookId}/authors/${authorId}`, {
    method: "DELETE",
    body: JSON.stringify({}),
  });
};