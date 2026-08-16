import { Loader2, Pencil } from "lucide-react";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { updateAuthor } from "../../services/authorService";

import type { Author } from "../../types";

interface EditAuthorDialogProps {
  author: Author;
  onSuccess: () => void;
}

const EditAuthorDialog = ({ author, onSuccess }: EditAuthorDialogProps) => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(author.name);

  const [bio, setBio] = useState(author.bio ?? "");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(author.name);
      setBio(author.bio ?? "");
      setError("");
    }
  }, [open, author]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Author name is required.");
      return;
    }

    try {
      setLoading(true);

      await updateAuthor(author.id, {
        name: name.trim(),
        bio: bio.trim() || undefined,
      });

      setOpen(false);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update author.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="inline-flex items-center gap-1.5">
            <Pencil className="size-3.5" />
            Edit
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Author</DialogTitle>

          <DialogDescription className="text-slate-400">
            Update the author's information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor={`edit-author-name-${author.id}`}
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Name
            </label>

            <input
              id={`edit-author-name-${author.id}`}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 focus:bg-white/10"
            />
          </div>

          <div>
            <label
              htmlFor={`edit-author-bio-${author.id}`}
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Biography
            </label>

            <textarea
              id={`edit-author-bio-${author.id}`}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 focus:bg-white/10"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="size-4" />
                  Update Author
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAuthorDialog;