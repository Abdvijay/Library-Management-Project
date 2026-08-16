import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  Search,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { getUser } from "../services/authStorage";
import { getMemberIssues } from "../services/memberService";

import type { IssueRecord } from "../types";

type StatusFilter = "ALL" | "ISSUED" | "OVERDUE" | "RETURNED";

const MyIssues = () => {
  const user = getUser();

  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIssues = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getMemberIssues(user.id);

      setIssues(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load your issues.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [user?.id]);

  const filteredIssues = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        !normalizedSearch ||
        issue.book?.title?.toLowerCase().includes(normalizedSearch) ||
        issue.book?.isbn?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || issue.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [issues, search, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">Member Area</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          My Issues
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your current and previous book borrowing records.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by book title or ISBN..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30 focus:bg-white/10"
          />
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {(["ALL", "ISSUED", "OVERDUE", "RETURNED"] as StatusFilter[]).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-white text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {status === "ALL"
                  ? "All"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-16 text-sm text-slate-400">
          <Loader2 className="mr-2 size-5 animate-spin" />
          Loading your issues...
        </div>
      ) : filteredIssues.length === 0 ? (
        /* Empty */
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
          <BookOpen className="mx-auto size-9 text-slate-600" />

          <p className="mt-3 text-sm font-medium text-slate-400">
            No issue records found.
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Book
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Issue Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Due Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Return Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    {/* Book */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                          <BookOpen className="size-4 text-slate-400" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {issue.book?.title ?? `Book #${issue.bookId}`}
                          </p>

                          {issue.book?.isbn && (
                            <p className="mt-1 text-xs text-slate-500">
                              ISBN: {issue.book.isbn}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Issue Date */}
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {formatDate(issue.issueDate)}
                    </td>

                    {/* Due Date */}
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {formatDate(issue.dueDate)}
                    </td>

                    {/* Return Date */}
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {issue.returnDate ? formatDate(issue.returnDate) : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <IssueStatus status={issue.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString();
};

const IssueStatus = ({ status }: { status: IssueRecord["status"] }) => {
  if (status === "OVERDUE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-300">
        <AlertTriangle className="size-3.5" />
        Overdue
      </span>
    );
  }

  if (status === "RETURNED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
        <CheckCircle2 className="size-3.5" />
        Returned
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300">
      <Clock3 className="size-3.5" />
      Issued
    </span>
  );
};

export default MyIssues;