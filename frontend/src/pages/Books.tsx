import {
  AlertCircle,
  BookOpen,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";

import { getUser } from "../services/authStorage";
import { getBooks, type AvailabilityFilter } from "../services/bookService";
import AddBookDialog from "../components/common/AddBookDialog";
import EditBookDialog from "../components/common/EditBookDialog";
import DeleteBookDialog from "../components/common/DeleteBookDialog";
import BookDetailsDialog from "../components/common/BookDetailsDialog";

import type { Book } from "../types";
import { Button } from "../components/ui/button";

const Books = () => {

  const user = getUser();

  const isLibrarian = user?.role === "LIBRARIAN";
  
  const [books, setBooks] = useState<Book[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [availability, setAvailability] = useState<AvailabilityFilter>("all");

  const fetchBooks = async (searchValue = search, availabilityValue = availability,) => {
    try {
      setLoading(true);
      setError("");

      const data = await getBooks({
        search: searchValue,
        availability: availabilityValue,
      });

      setBooks(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load books.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(search, availability);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search, availability]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Library Collection
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">Books</h1>

          <p className="mt-2 text-sm text-slate-400">
            Browse and manage books in your library.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => fetchBooks()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </Button>

          {isLibrarian && (
            <AddBookDialog
                onSuccess={() => {
                fetchBooks();
              }}
            />
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, ISBN, or category..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/25 focus:bg-white/[0.07]"
          />
        </div>

        <select
          value={availability}
          onChange={(event) =>
            setAvailability(event.target.value as AvailabilityFilter)
          }
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25 sm:w-52"
        >
          <option value="all">All availability</option>

          <option value="available">Available</option>

          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" />

          <div>
            <p className="text-sm font-semibold text-red-300">
              Unable to load books
            </p>

            <p className="mt-1 text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Loading books...
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && books.length === 0 && (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5">
            <BookOpen className="size-5 text-slate-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold">No books found</h2>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {search || availability !== "all"
                ? "Try changing your search or availability filter."
                : "There are no books in the library yet."}
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && !error && books.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Book
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      ISBN
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Copies
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-white">{book.title}</p>

                          {book.publishedYear && (
                            <p className="mt-1 text-xs text-slate-500">
                              Published {book.publishedYear}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {book.isbn}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        <span className="font-medium">
                          {book.availableCopies}
                        </span>

                        <span className="text-slate-600"> / </span>

                        {book.totalCopies}
                      </td>

                      <td className="px-5 py-4">
                        {book.availableCopies > 0 ? (
                          <span className="inline-flex rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-300">
                            Unavailable
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <BookDetailsDialog book={book} />
                            {isLibrarian && (
                              <>
                                <EditBookDialog
                                  book={book}
                                  onSuccess={() => fetchBooks()}
                                />

                                <DeleteBookDialog
                                  book={book}
                                  onSuccess={() => fetchBooks()}
                                />
                              </>
                            )}
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-3 md:hidden">
            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-white">
                      {book.title}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">{book.isbn}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {book.availableCopies > 0 ? (
                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-300">
                        Unavailable
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <BookDetailsDialog book={book} />
                      {isLibrarian && (
                        <>
                          <EditBookDialog
                            book={book}
                            onSuccess={fetchBooks}
                          />

                          <DeleteBookDialog
                            book={book}
                            onSuccess={fetchBooks}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Category</p>

                    <p className="mt-1 text-sm text-slate-300">
                      {book.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Copies</p>

                    <p className="mt-1 text-sm text-slate-300">
                      {book.availableCopies} / {book.totalCopies}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Books;