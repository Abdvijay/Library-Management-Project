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

import { updateMember } from "../../services/memberService";

import type { Member } from "../../types";

interface EditMemberDialogProps {
  member: Member;
  onSuccess: () => void;
}

const EditMemberDialog = ({ member, onSuccess }: EditMemberDialogProps) => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(member.name);
      setEmail(member.email);
      setError("");
    }
  }, [open, member]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateMember(member.id, {
        name: name.trim(),
        email: email.trim(),
      });

      onSuccess();
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update member.",
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Pencil className="size-3.5 shrink-0" />
          Edit
        </button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>

          <DialogDescription className="text-slate-400">
            Update the member's information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label
              htmlFor={`member-name-${member.id}`}
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Name
            </label>

            <input
              id={`member-name-${member.id}`}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
              placeholder="Enter member name"
            />
          </div>

          <div>
            <label
              htmlFor={`member-email-${member.id}`}
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id={`member-email-${member.id}`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
              placeholder="Enter member email"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}

              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;