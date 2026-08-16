import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";

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

import { returnBook } from "../../services/issueService";

import type { IssueRecord } from "../../types";

interface ReturnBookDialogProps {
  issue: IssueRecord;
  onSuccess: () => void;
}

const ReturnBookDialog = ({ issue, onSuccess }: ReturnBookDialogProps) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleReturn = async () => {
    try {
      setLoading(true);
      setError("");

      await returnBook(issue.id);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to return book.",
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
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/10"
        >
          <RotateCcw className="size-3.5" />
          Return
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <AlertTriangle className="size-5" />
          </div>

          <AlertDialogTitle>Return Book?</AlertDialogTitle>

          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to mark{" "}
            <span className="font-semibold text-slate-200">
              "{issue.book?.title ?? `Book #${issue.bookId}`}"
            </span>{" "}
            as returned?
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
              handleReturn();
            }}
            className="bg-emerald-500 text-white hover:bg-emerald-600"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Returning...
              </>
            ) : (
              <>
                <RotateCcw className="size-4" />
                Return Book
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReturnBookDialog;