import { BookOpen, Loader2 } from "lucide-react";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { getMemberIssues } from "../../services/memberService";

import type { IssueRecord, Member } from "../../types";

interface MemberHistoryDialogProps {
  member: Member;
}

const MemberHistoryDialog = ({ member }: MemberHistoryDialogProps) => {
  const [open, setOpen] = useState(false);

  const [issues, setIssues] = useState<IssueRecord[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMemberIssues(member.id);

        setIssues(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load borrowing history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [open, member.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <BookOpen className="size-3.5" />
          History
        </button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Borrowing History</DialogTitle>

          <DialogDescription className="text-slate-400">
            Borrowing history for{" "}
            <span className="font-medium text-slate-300">{member.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-slate-400">
              <Loader2 className="mr-2 size-5 animate-spin" />
              Loading history...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : issues.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-slate-500">
              This member has no borrowing history.
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white">
                        {issue.book?.title ?? `Book #${issue.bookId}`}
                      </p>

                      <div className="mt-2 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
                        <p>
                          Issued:{" "}
                          {new Date(issue.issueDate).toLocaleDateString()}
                        </p>

                        <p>
                          Due: {new Date(issue.dueDate).toLocaleDateString()}
                        </p>

                        {issue.returnDate && (
                          <p>
                            Returned:{" "}
                            {new Date(issue.returnDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        issue.status === "OVERDUE"
                          ? "bg-red-400/10 text-red-300"
                          : issue.status === "RETURNED"
                            ? "bg-white/5 text-slate-400"
                            : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberHistoryDialog;