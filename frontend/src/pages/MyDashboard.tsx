import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { getUser } from "../services/authStorage";
import { getMemberIssues } from "../services/memberService";

import type { IssueRecord } from "../types";

const MyDashboard = () => {
  const user = getUser();

  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMemberIssues(user.id);

        setIssues(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your library activity.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [user?.id]);

  const statistics = useMemo(() => {
    const totalBorrowed = issues.length;

    const currentlyOut = issues.filter(
      (issue) => issue.status === "ISSUED" || issue.status === "OVERDUE",
    ).length;

    const overdue = issues.filter((issue) => issue.status === "OVERDUE").length;

    const returned = issues.filter(
      (issue) => issue.status === "RETURNED",
    ).length;

    return {
      totalBorrowed,
      currentlyOut,
      overdue,
      returned,
    };
  }, [issues]);

  const recentIssues = issues.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">Member Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {user?.name}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here's an overview of your library activity.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
          <Loader2 className="size-4 animate-spin" />
          Loading your library activity...
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MemberStatCard
          title="Total Borrowed"
          value={statistics.totalBorrowed}
          description="Books you've borrowed"
          icon={BookOpen}
        />

        <MemberStatCard
          title="Currently Out"
          value={statistics.currentlyOut}
          description="Books currently with you"
          icon={Clock3}
        />

        <MemberStatCard
          title="Overdue"
          value={statistics.overdue}
          description="Books requiring attention"
          icon={AlertTriangle}
        />

        <MemberStatCard
          title="Returned"
          value={statistics.returned}
          description="Books already returned"
          icon={CheckCircle2}
        />
      </div>

      {/* Recent Borrowing Activity */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Recent Borrowing Activity</h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest book borrowing records.
          </p>
        </div>

        {recentIssues.length === 0 && !loading ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
            <BookOpen className="mx-auto size-8 text-slate-600" />

            <p className="mt-3 text-sm font-medium text-slate-400">
              No borrowing history yet.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Your borrowed books will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="my-dashboard-scrollbar max-h-[520px] overflow-auto">
              <table className="w-full min-w-[700px]">
                <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md">
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
                  {recentIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                            <BookOpen className="size-4 text-slate-400" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {issue.book?.title ?? `Book #${issue.bookId}`}
                            </p>

                            {issue.book?.category && (
                              <p className="mt-1 text-xs text-slate-500">
                                {issue.book.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {formatDate(issue.issueDate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {formatDate(issue.dueDate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {issue.returnDate ? formatDate(issue.returnDate) : "—"}
                      </td>

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

interface MemberStatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

const MemberStatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: MemberStatCardProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
          <Icon className="size-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
};

export default MyDashboard;