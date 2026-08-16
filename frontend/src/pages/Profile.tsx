import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { getUser } from "../services/authStorage";

const Profile = () => {
  const user = getUser();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-400">Member Area</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10">
            <UserRound className="size-7 text-slate-300" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-white">
              {user?.name ?? "Member"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">Library Member</p>
          </div>
        </div>

        {/* Information */}
        <div className="mt-6 space-y-4">
          {/* Name */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <UserRound className="size-5 text-slate-500" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {user?.name ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-slate-500" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-200">
                  {user?.email ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-slate-500" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Role
                </p>

                <span className="mt-1 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300">
                  {user?.role ?? "MEMBER"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;