import { useState } from "react";
import type { FormEvent } from "react";

import { BookOpen, Loader2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Button } from "../ui/button";

import { createBook } from "../../services/bookService";

interface AddBookDialogProps {
  onSuccess: () => void;
}

const AddBookDialog = ({ onSuccess }: AddBookDialogProps) => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");

  const [isbn, setIsbn] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");

  const [totalCopies, setTotalCopies] = useState("1");

  const [publishedYear, setPublishedYear] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setIsbn("");
    setDescription("");
    setCategory("");
    setTotalCopies("1");
    setPublishedYear("");
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Book title is required.");
      return;
    }

    if (!isbn.trim()) {
      setError("ISBN is required.");
      return;
    }

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    const copies = Number(totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      setError("Total copies must be at least 1.");
      return;
    }

    let year: number | undefined;

    if (publishedYear.trim()) {
      year = Number(publishedYear);

      if (
        !Number.isInteger(year) ||
        year < 1000 ||
        year > new Date().getFullYear()
      ) {
        setError("Please enter a valid published year.");
        return;
      }
    }

    try {
      setLoading(true);

      await createBook({
        title: title.trim(),
        isbn: isbn.trim(),
        description: description.trim() || undefined,
        category: category.trim(),
        totalCopies: copies,
        publishedYear: year,
      });

      resetForm();
      setOpen(false);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create book.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" />
          Add Book
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-1.5rem)] max-w-lg overflow-hidden border-white/10 bg-slate-950 p-0 text-white shadow-2xl shadow-black/30 sm:w-full">
        <div className="dialog-scrollbar max-h-[90vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950">
                <BookOpen className="size-4" />
              </div>

              <span>Add Book</span>
            </DialogTitle>

            <DialogDescription className="text-sm leading-5 text-slate-400">
              Add a new book to the library collection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3.5 py-3 text-sm leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="book-title"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Title <span className="text-red-400">*</span>
              </label>

              <input
                id="book-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter book title"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
              />
            </div>

            {/* ISBN */}
            <div>
              <label
                htmlFor="book-isbn"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                ISBN <span className="text-red-400">*</span>
              </label>

              <input
                id="book-isbn"
                type="text"
                value={isbn}
                onChange={(event) => setIsbn(event.target.value)}
                placeholder="Enter ISBN"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="book-category"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Category <span className="text-red-400">*</span>
              </label>

              <input
                id="book-category"
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. Programming"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
              />
            </div>

            {/* Copies + Year */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="book-copies"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Total Copies <span className="text-red-400">*</span>
                </label>

                <input
                  id="book-copies"
                  type="number"
                  min="1"
                  value={totalCopies}
                  onChange={(event) => setTotalCopies(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                />
              </div>

              <div>
                <label
                  htmlFor="book-year"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Published Year
                </label>

                <input
                  id="book-year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={publishedYear}
                  onChange={(event) => setPublishedYear(event.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="book-description"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="book-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter a short description"
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2.5 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Create Book
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookDialog;