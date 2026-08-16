import { BookOpen, CalendarDays, Loader2 } from "lucide-react";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { getBooks } from "../../services/bookService";
import { getMembers } from "../../services/memberService";
import { createIssue } from "../../services/issueService";

import type { Book, Member } from "../../types";

interface IssueBookDialogProps {
  onSuccess: () => void;
}

const IssueBookDialog = ({ onSuccess }: IssueBookDialogProps) => {
  const [open, setOpen] = useState(false);

  const [books, setBooks] = useState<Book[]>([]);

  const [members, setMembers] = useState<Member[]>([]);

  const [bookId, setBookId] = useState("");

  const [memberId, setMemberId] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [availableBooks, allMembers] = await Promise.all([
          getBooks({
            availability: "available",
          }),
          getMembers(),
        ]);

        setBooks(availableBooks);

        setMembers(allMembers.filter((member) => member.role === "MEMBER"));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load books and members.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [open]);

  const resetForm = () => {
    setBookId("");
    setMemberId("");
    setDueDate("");
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!bookId) {
      setError("Please select a book.");
      return;
    }

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    try {
      setLoading(true);

      await createIssue({
        bookId: Number(bookId),
        memberId: Number(memberId),
        dueDate,
      });

      setOpen(false);

      resetForm();

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to issue book.",
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
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          <BookOpen className="size-4" />
          Issue Book
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-hidden border-white/10 bg-slate-950 p-0 text-white sm:max-w-lg">
        <div className="dialog-scrollbar max-h-[90vh] overflow-y-auto px-6 py-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-950">
                <BookOpen className="size-5" />
              </div>
              Issue Book
            </DialogTitle>

            <DialogDescription className="text-slate-400">
              Issue an available book to a library member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {loadingData ? (
              <div className="flex min-h-40 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="size-4 animate-spin" />
                  Loading books and members...
                </div>
              </div>
            ) : (
              <>
                {/* Book */}
                <div>
                  <label
                    htmlFor="issue-book"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Book <span className="text-red-400">*</span>
                  </label>

                  <select
                    id="issue-book"
                    value={bookId}
                    onChange={(event) => setBookId(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                  >
                    <option value="">Select an available book</option>

                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} — {book.availableCopies} available
                      </option>
                    ))}
                  </select>

                  {books.length === 0 && (
                    <p className="mt-2 text-xs text-amber-300">
                      No books are currently available.
                    </p>
                  )}
                </div>

                {/* Member */}
                <div>
                  <label
                    htmlFor="issue-member"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Member <span className="text-red-400">*</span>
                  </label>

                  <select
                    id="issue-member"
                    value={memberId}
                    onChange={(event) => setMemberId(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                  >
                    <option value="">Select a member</option>

                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} — {member.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label
                    htmlFor="issue-due-date"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Due Date <span className="text-red-400">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="issue-due-date"
                      type="date"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-white/30"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || loadingData || books.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Issuing...
                  </>
                ) : (
                  <>
                    <BookOpen className="size-4" />
                    Issue Book
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

export default IssueBookDialog;