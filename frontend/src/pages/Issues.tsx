import {
  AlertCircle,
  CalendarDays,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import type { IssueRecord } from "../types";

import { getIssues } from "../services/issueService";
import IssueBookDialog from "@/components/common/IssueBookingDialog";
import ReturnBookDialog from "../components/common/ReturnBookDialog";

const Issues = () => {
  const [issues, setIssues] = useState<IssueRecord[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getIssues();

      setIssues(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load issues.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const filteredIssues = issues.filter((issue) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      issue.book?.title?.toLowerCase().includes(searchValue) ||
      issue.member?.name?.toLowerCase().includes(searchValue) ||
      issue.member?.email?.toLowerCase().includes(searchValue);

    const matchesStatus = status === "all" || issue.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Lending Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Issues
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage issued books and returns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fetchIssues()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <IssueBookDialog
            onSuccess={fetchIssues}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by book or member..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/25 focus:bg-white/[0.07]"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25 sm:w-52"
        >
          <option value="all">All Status</option>

          <option value="ISSUED">Issued</option>

          <option value="RETURNED">Returned</option>

          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <AlertCircle className="size-5 shrink-0 text-red-400" />

          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Loading issues...
          </div>
        </div>
      ) : filteredIssues.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5">
            <CalendarDays className="size-5 text-slate-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            No issues found
          </h2>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {search || status !== "all"
              ? "Try changing your search or status filter."
              : "No books have been issued yet."}
          </p>
        </div>
      ) : (
        /* Desktop Table */
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="issues-scrollbar max-h-[520px] overflow-auto">
            <table className="w-full min-w-[850px]">
              <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md">
                <tr className="border-b border-white/10">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Book
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Issue Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Due Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
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
                      <div className="font-medium text-white">
                        {issue.book?.title ?? `Book #${issue.bookId}`}
                      </div>

                      {issue.book?.isbn && (
                        <div className="mt-1 text-xs text-slate-500">
                          {issue.book.isbn}
                        </div>
                      )}
                    </td>

                    {/* Member */}
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-slate-300">
                        {issue.member?.name ?? `Member #${issue.memberId}`}
                      </div>

                      {issue.member?.email && (
                        <div className="mt-1 text-xs text-slate-500">
                          {issue.member.email}
                        </div>
                      )}
                    </td>

                    {/* Issue Date */}
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {issue.issueDate}
                    </td>

                    {/* Due Date */}
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {issue.dueDate}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          issue.status === "OVERDUE"
                            ? "bg-red-400/10 text-red-300"
                            : issue.status === "RETURNED"
                              ? "bg-white/5 text-slate-400"
                              : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      {(issue.status === "ISSUED" ||
                        issue.status === "OVERDUE") && (
                        <ReturnBookDialog
                          issue={issue}
                          onSuccess={fetchIssues}
                        />
                      )}
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

export default Issues;