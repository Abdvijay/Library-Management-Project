import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { BookOpen, Loader2, Pencil, Plus, X, AlertTriangle, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { getBookById, updateBook } from "../../services/bookService";
import { assignAuthorToBook, getAuthors, removeAuthorFromBook } from "../../services/authorService";

import type { Author, Book } from "../../types";

interface EditBookDialogProps {
  book: Book;
  onSuccess: () => void;
}

const EditBookDialog = ({ book, onSuccess }: EditBookDialogProps) => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [publishedYear, setPublishedYear] = useState("");

  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [authorLoading, setAuthorLoading] = useState(false);
  const [assigningAuthor, setAssigningAuthor] = useState(false);
  const [assignedAuthors, setAssignedAuthors] = useState<Author[]>([]);
  const [removingAuthorId, setRemovingAuthorId] = useState<number | null>(null);
  const [authorToRemove, setAuthorToRemove] = useState<Author | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(book.title);
      setIsbn(book.isbn);
      setDescription(book.description ?? "");
      setCategory(book.category);
      setTotalCopies(String(book.totalCopies));
      setPublishedYear(
        book.publishedYear
          ? String(book.publishedYear)
          : ""
      );

      setError("");
      setSelectedAuthorId("");
      setAssignedAuthors([]);

      setAuthorLoading(true);

      getAuthors()
        .then((data) => {
          setAuthors(data);
        })
        .catch(() => {
          setError("Unable to load authors.");
        });

      getBookById(book.id)
        .then((data) => {
          setAssignedAuthors(data.authors);
        })
        .catch(() => {
          setError("Unable to load assigned authors.");
        })
        .finally(() => {
          setAuthorLoading(false);
        });
    }
  }, [open, book]);

  const handleAssignAuthor = async () => {
    if (!selectedAuthorId) {
      setError("Please select an author.");
      return;
    }

    try {
      setAssigningAuthor(true);
      setError("");

      await assignAuthorToBook(
        book.id,
        Number(selectedAuthorId)
      );

      const updatedBook =
        await getBookById(book.id);

      setAssignedAuthors(
        updatedBook.authors
      );

      setSelectedAuthorId("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to assign author."
      );
    } finally {
      setAssigningAuthor(false);
    }
  };

  const handleRemoveAuthor = async (authorId: number) => {
    try {
      setRemovingAuthorId(authorId);
      setError("");

      await removeAuthorFromBook(
        book.id,
        authorId
      );

      const updatedBook =
        await getBookById(book.id);

      setAssignedAuthors(
        updatedBook.authors
      );

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove author."
      );
    } finally {
      setRemovingAuthorId(null);
    }
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

    if (copies < issuedCopies) {
      setError(
        `Total copies cannot be less than ${issuedCopies}, because ${issuedCopies} ${issuedCopies === 1 ? "copy is" : "copies are"} currently issued.`,
      );
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

      await updateBook(book.id, {
        title: title.trim(),
        isbn: isbn.trim(),
        description: description.trim() || undefined,
        category: category.trim(),
        totalCopies: copies,
        publishedYear: year,
      });

      setOpen(false);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update book.",
      );
    } finally {
      setLoading(false);
    }
  };

  const issuedCopies = book.totalCopies - book.availableCopies;
 
  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              title="Edit book"
            >
              <Pencil className="size-4" />
            </button>
          </DialogTrigger>

          <DialogContent className="w-[calc(100%-1.5rem)] max-w-lg overflow-hidden border-white/10 bg-slate-950 p-0 text-white shadow-2xl shadow-black/30 sm:w-full">
            <div className="dialog-scrollbar max-h-[90vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950">
                    <BookOpen className="size-4" />
                  </div>

                  <span>Edit Book</span>
                </DialogTitle>

                <DialogDescription className="text-sm leading-5 text-slate-400">
                  Update the information for this book.
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
                    htmlFor={`edit-title-${book.id}`}
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Title <span className="text-red-400">*</span>
                  </label>

                  <input
                    id={`edit-title-${book.id}`}
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label
                    htmlFor={`edit-isbn-${book.id}`}
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    ISBN <span className="text-red-400">*</span>
                  </label>

                  <input
                    id={`edit-isbn-${book.id}`}
                    type="text"
                    value={isbn}
                    onChange={(event) => setIsbn(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor={`edit-category-${book.id}`}
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Category <span className="text-red-400">*</span>
                  </label>

                  <input
                    id={`edit-category-${book.id}`}
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                  />
                </div>

                {/* Copies + Year */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`edit-copies-${book.id}`}
                      className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                      Total Copies <span className="text-red-400">*</span>
                    </label>

                    <input
                      id={`edit-copies-${book.id}`}
                      type="number"
                      min={Math.max(1, issuedCopies)}
                      value={totalCopies}
                      onChange={(event) => setTotalCopies(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                    />

                    {issuedCopies > 0 && (
                      <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        {issuedCopies}{" "}
                        {issuedCopies === 1 ? "copy is" : "copies are"} currently
                        issued.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`edit-year-${book.id}`}
                      className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                      Published Year
                    </label>

                    <input
                      id={`edit-year-${book.id}`}
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
                    htmlFor={`edit-description-${book.id}`}
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id={`edit-description-${book.id}`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
                  />
                </div>

                {/* Authors */}
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">
                      Authors
                    </label>

                    {authorLoading ? (
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-400">
                        <Loader2 className="size-4 shrink-0 animate-spin" />
                        Loading authors...
                      </div>
                    ) : assignedAuthors.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-slate-500">
                        No authors assigned to this book.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {assignedAuthors.map((author) => (
                          <div
                            key={author.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {author.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                Author ID #{author.id}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setAuthorToRemove(author)}
                              disabled={
                                removingAuthorId === author.id ||
                                assigningAuthor ||
                                loading
                              }
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/5 px-2.5 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {removingAuthorId === author.id ? (
                                <Loader2 className="size-3.5 shrink-0 animate-spin" />
                              ) : (
                                <X className="size-3.5 shrink-0" />
                              )}

                              <span>Remove</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assign Author */}
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <select
                      value={selectedAuthorId}
                      onChange={(event) => setSelectedAuthorId(event.target.value)}
                      disabled={authorLoading || assigningAuthor || loading}
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select an author</option>

                      {authors
                        .filter(
                          (author) =>
                            !assignedAuthors.some(
                              (assigned) => assigned.id === author.id,
                            ),
                        )
                        .map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.name}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAssignAuthor}
                      disabled={
                        !selectedAuthorId ||
                        authorLoading ||
                        assigningAuthor ||
                        loading
                      }
                      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {assigningAuthor ? (
                        <Loader2 className="size-4 shrink-0 animate-spin" />
                      ) : (
                        <Plus className="size-4 shrink-0" />
                      )}

                      Assign
                    </button>
                  </div>
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Pencil className="size-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={authorToRemove !== null}
          onOpenChange={(value) => {
            if (!value) {
              setAuthorToRemove(null);
            }
          }}
        >
          <AlertDialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
            <AlertDialogHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                <AlertTriangle className="size-5" />
              </div>

              <AlertDialogTitle>
                Remove Author?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-slate-400">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-slate-200">
                  "{authorToRemove?.name}"
                </span>{" "}
                from this book?
              </AlertDialogDescription>
            </AlertDialogHeader>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={removingAuthorId !== null}
                className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={removingAuthorId !== null}
                onClick={(event) => {
                  event.preventDefault();

                  if (authorToRemove) {
                    handleRemoveAuthor(
                      authorToRemove.id
                    ).then(() => {
                      setAuthorToRemove(null);
                    });
                  }
                }}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {removingAuthorId !== null ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Remove Author
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div> 
  );
};

export default EditBookDialog;