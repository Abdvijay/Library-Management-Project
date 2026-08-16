import { BookOpen, CalendarDays, Library, UserRound } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import type { Book } from "../../types";

interface BookDetailsDialogProps {
  book: Book;
}

const BookDetailsDialog = ({ book }: BookDetailsDialogProps) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <BookOpen className="size-3.5" />
          View Details
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-hidden border-white/10 bg-slate-950 p-0 text-white sm:max-w-lg">
        <div className="dialog-scrollbar max-h-[90vh] overflow-y-auto px-6 py-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white text-slate-950">
                <BookOpen className="size-4" />
              </div>
              Book Details
            </DialogTitle>

            <DialogDescription className="text-slate-400">
              View complete information about this book.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5">
            {/* Title */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Title
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {book.title}
              </p>
            </div>

            {/* ISBN + Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  ISBN
                </p>

                <p className="mt-1 text-sm text-slate-300">{book.isbn}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Category
                </p>

                <p className="mt-1 text-sm text-slate-300">{book.category}</p>
              </div>
            </div>

            {/* Published Year */}
            {book.publishedYear && (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/5">
                  <CalendarDays className="size-4 text-slate-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Published Year</p>

                  <p className="mt-0.5 text-sm text-slate-300">
                    {book.publishedYear}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {book.description?.trim()
                  ? book.description
                  : "No description available."}
              </p>
            </div>

            {/* Authors */}
            <div>
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-slate-500" />

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Authors
                </p>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                Author information is shown in the book details available from
                the selected book.
              </p>
            </div>

            {/* Copies */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-500">Total</p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {book.totalCopies}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-500">Available</p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {book.availableCopies}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-500">Issued</p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {book.totalCopies - book.availableCopies}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                isAvailable
                  ? "border-emerald-400/20 bg-emerald-400/5"
                  : "border-red-400/20 bg-red-400/5"
              }`}
            >
              <Library
                className={`size-5 ${
                  isAvailable ? "text-emerald-400" : "text-red-400"
                }`}
              />

              <div>
                <p className="text-xs text-slate-500">Availability</p>

                <p
                  className={`mt-0.5 text-sm font-medium ${
                    isAvailable ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {isAvailable
                    ? `${book.availableCopies} ${
                        book.availableCopies === 1 ? "copy" : "copies"
                      } available`
                    : "Currently unavailable"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsDialog;