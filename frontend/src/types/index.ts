export interface User {
  id: number;
  name: string;
  email: string;
  role: "LIBRARIAN" | "MEMBER";
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string | null;
  category: string;
  totalCopies: number;
  availableCopies: number;
  publishedYear: number | null;
}

export interface Author {
  id: number;
  name: string;
  bio: string | null;
  createdAt: string;
}

export interface BookWithAuthors extends Book {
  authors: Author[];
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: "LIBRARIAN" | "MEMBER";
  createdAt: string;
}

export interface IssueRecord {
  id: number;
  bookId: number;
  memberId: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "ISSUED" | "RETURNED" | "OVERDUE";
  book?: Book;
  member?: Member;
}

export interface AuthorBook {
  id: number;
  title: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  publishedYear: number | null;
}