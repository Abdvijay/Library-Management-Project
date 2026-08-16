import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { useState } from "react";

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

import { deleteAuthor } from "../../services/authorService";

import type { Author } from "../../types";

interface DeleteAuthorDialogProps {
  author: Author;
  onSuccess: () => void;
}

const DeleteAuthorDialog = ({ author, onSuccess }: DeleteAuthorDialogProps) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await deleteAuthor(author.id);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete author.",
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
          className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10"
        >
          <span className="inline-flex items-center gap-1.5">
            <Trash2 className="size-3.5" />
            Delete
          </span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
            <AlertTriangle className="size-5" />
          </div>

          <AlertDialogTitle>Delete Author?</AlertDialogTitle>

          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-200">
              "{author.name}"
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Author
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAuthorDialog;