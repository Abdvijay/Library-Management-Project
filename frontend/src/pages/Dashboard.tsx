import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Library,
  Plus,
  RefreshCw,
  Users,
  Loader2
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";

import { getDashboardStats, type DashboardStats,} from "../services/dashboardService";
import { getUser } from "../services/authStorage";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: typeof BookOpen;
}

const StatCard = ({ title, value, description, icon: Icon }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-400">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-slate-200">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
};

interface QuickActionProps {
  to: "/books" | "/authors" | "/members" | "/issues";

  title: string;
  description: string;
  icon: typeof Plus;
}

const QuickAction = ({
  to,
  title,
  description,
  icon: Icon,
}: QuickActionProps) => {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{title}</p>

          <p className="mt-0.5 truncate text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <ArrowRight className="size-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
    </Link>
  );
};

const Dashboard = () => {
  const user = getUser();

  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getDashboardStats();

      setStats(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Library Overview</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-2 text-sm text-slate-400">
            Welcome back, {user?.name}. Here's what's happening in your library.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-400" />

          <div>
            <p className="text-sm font-semibold text-red-300">
              Unable to load dashboard
            </p>

            <p className="mt-1 text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
          <Loader2 className="size-4 animate-spin" />
          Loading dashboard...
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Books"
          value={stats?.totalBooks ?? 0}
          description="Books in collection"
          icon={BookOpen}
        />

        <StatCard
          title="Available Books"
          value={stats?.availableCopies ?? 0}
          description="Copies currently available"
          icon={Library}
        />

        <StatCard
          title="Members"
          value={stats?.totalMembers ?? 0}
          description="Registered members"
          icon={Users}
        />

        <StatCard
          title="Authors"
          value={stats?.totalAuthors ?? 0}
          description="Authors in library"
          icon={Library}
        />
      </div>

      {/* Issue Statistics */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Borrowing Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current book issue status.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Active Issues
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {stats?.activeIssues ?? 0}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                <BookOpen className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Books currently borrowed.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Overdue Issues
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {stats?.overdueIssues ?? 0}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                <AlertTriangle className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Books requiring attention.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Issued Copies
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {stats?.issuedCopies ?? 0}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                <BookOpen className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Copies currently issued.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly access common library operations.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            to="/books"
            title="Manage Books"
            description="View and manage books"
            icon={BookOpen}
          />

          <QuickAction
            to="/authors"
            title="Manage Authors"
            description="View library authors"
            icon={Library}
          />

          <QuickAction
            to="/members"
            title="Manage Members"
            description="View registered members"
            icon={Users}
          />

          <QuickAction
            to="/issues"
            title="Manage Issues"
            description="Track borrowed books"
            icon={Plus}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;