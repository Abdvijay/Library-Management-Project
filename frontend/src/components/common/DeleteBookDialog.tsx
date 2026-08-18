import { useState } from "react";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import { deleteBook } from "../../services/bookService";

import type { Book } from "../../types";

interface DeleteBookDialogProps {
  book: Book;
  onSuccess: () => void;
}

const DeleteBookDialog = ({ book, onSuccess }: DeleteBookDialogProps) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await deleteBook(book.id);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete book.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (open) {
          setError("");
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <button
          type="button"
          title="Delete book"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/5 text-red-400 transition hover:bg-red-400/10 hover:text-red-300"
        >
          <Trash2 className="size-4" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[calc(100%-1.5rem)] max-w-md border-white/10 bg-slate-950 p-5 text-white shadow-2xl shadow-black/30 sm:w-full sm:p-6">
        <AlertDialogHeader className="space-y-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
            <AlertTriangle className="size-5" />
          </div>

          <div className="space-y-1.5">
            <AlertDialogTitle className="text-lg font-semibold text-white">
              Delete Book?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-5 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-200">
                "{book.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {error && (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3.5 py-3 text-sm leading-5 text-red-300">
            {error}
          </div>
        )}

        <AlertDialogFooter className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={loading}
            className="m-0 min-h-10 rounded-xl border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="m-0 min-h-10 rounded-xl bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Book
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBookDialog;