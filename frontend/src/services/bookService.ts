import { apiRequest } from "./api";

import type { Book, BookWithAuthors } from "../types";

export type AvailabilityFilter = "all" | "available" | "unavailable";

interface GetBooksOptions {
  search?: string;
  availability?: AvailabilityFilter;
}

export const getBooks = async (options: GetBooksOptions = {}) => {
  const params = new URLSearchParams();

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }

  if (options.availability && options.availability !== "all") {
    params.set("availability", options.availability);
  }

  const queryString = params.toString();

  const endpoint = queryString ? `/books?${queryString}` : "/books";

  const response = await apiRequest(endpoint);

  return response.data as Book[];
};

export const getBookById = async (id: number) => {
  const response = await apiRequest(`/books/${id}`);

  return response.data as BookWithAuthors;
};

export const createBook = async (bookData: Partial<Book>) => {
  return apiRequest("/books", {
    method: "POST",
    body: JSON.stringify(bookData),
  });
};

export const updateBook = async (id: number, bookData: Partial<Book>) => {
  return apiRequest(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
  });
};

export const deleteBook = async (id: number) => {
  return apiRequest(`/books/${id}`, {
    method: "DELETE",
  });
};