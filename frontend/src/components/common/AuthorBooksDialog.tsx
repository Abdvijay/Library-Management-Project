import { BookOpen, Loader2 } from "lucide-react";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { getAuthorBooks } from "../../services/authorService";

import type { Author, AuthorBook } from "../../types";

interface AuthorBooksDialogProps {
  author: Author;
}

const AuthorBooksDialog = ({ author }: AuthorBooksDialogProps) => {
  const [open, setOpen] = useState(false);

  const [books, setBooks] = useState<AuthorBook[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAuthorBooks(author.id);

        setBooks(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to load books.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [open, author.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" />
            Books
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Books by {author.name}</DialogTitle>

          <DialogDescription className="text-slate-400">
            Books currently assigned to this author.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-slate-400">
              <Loader2 className="mr-2 size-5 animate-spin" />
              Loading books...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : books.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-500">
              No books assigned to this author.
            </div>
          ) : (
            <div className="space-y-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <BookOpen className="size-4 text-slate-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-white">{book.title}</p>

                      <p className="mt-1 text-xs text-slate-500">
                        ISBN: {book.isbn}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-slate-400">
                          {book.category}
                        </span>

                        <span className="rounded-lg bg-white/5 px-2 py-1 text-slate-400">
                          {book.availableCopies} / {book.totalCopies} available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorBooksDialog;