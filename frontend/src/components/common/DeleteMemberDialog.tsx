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

import { deleteMember } from "../../services/memberService";

import type { Member } from "../../types";

interface DeleteMemberDialogProps {
  member: Member;
  onSuccess: () => void;
}

const DeleteMemberDialog = ({ member, onSuccess }: DeleteMemberDialogProps) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await deleteMember(member.id);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete member."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open) {
          setError("");
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10"
        >
          <Trash2 className="size-3.5 shrink-0" />
          Delete
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
            <AlertTriangle className="size-5" />
          </div>

          <AlertDialogTitle>Delete Member?</AlertDialogTitle>

          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-200">
              "{member.name}"
            </span>
            ?
            <br />
            This action cannot be undone.
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
            onClick={handleDelete}
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
                Delete Member
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMemberDialog;