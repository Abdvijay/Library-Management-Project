import {
  CheckCircle2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { getUser } from "../services/authStorage";

const Profile = () => {
  const user = getUser();

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">
          Member Area
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your account information and membership details.
        </p>
      </div>

      {/* Profile Content */}
      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Profile Summary */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/10 sm:p-6">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-white/[0.04] blur-2xl" />

          <div className="relative">
            {/* Avatar + Basic Info */}
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <UserRound className="size-7 text-slate-300" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-white">
                  {user?.name ?? "Member"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Library Member
                </p>
              </div>
            </div>

            {/* Active Status */}
            <div className="mt-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <CheckCircle2 className="size-3.5" />
                Active Member
              </span>
            </div>

            {/* Account Type */}
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Account Type
              </p>

              <div className="mt-2 flex items-center gap-2">
                <ShieldCheck className="size-4 text-slate-500" />

                <span className="text-sm font-semibold text-slate-300">
                  {user?.role ?? "MEMBER"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/10 sm:p-6">
          {/* Section Header */}
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-semibold text-white">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your registered library account details.
            </p>
          </div>

          {/* Information */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {/* Name */}
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <UserRound className="size-4 text-slate-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                    {user?.name ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Mail className="size-4 text-slate-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Email Address
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                    {user?.email ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <ShieldCheck className="size-4 text-slate-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                      Account Role
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      Library Member
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {user?.role ?? "MEMBER"}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Notice */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <p className="text-xs leading-5 text-slate-500">
              Profile information is managed by the library administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;