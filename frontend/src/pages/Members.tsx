import {
  AlertCircle,
  Mail,
  RefreshCw,
  Search,
  Shield,
  User,
  Users,
  Loader2,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { Member } from "../types";

import { getMembers } from "../services/memberService";
import AddMemberDialog from "../components/common/AddMemberDialog";
import MemberHistoryDialog from "../components/common/MemberHistoryDialog";
import EditMemberDialog from "../components/common/EditMemberDialog";
import DeleteMemberDialog from "../components/common/DeleteMemberDialog";

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMembers();

      setMembers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load members.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return members;
    }

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(value) ||
        member.email.toLowerCase().includes(value),
    );
  }, [members, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Library Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Members
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            View registered library members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchMembers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${
                loading ? "animate-spin" : ""
               }`}
            />

            Refresh
          </button>

          <AddMemberDialog
            onSuccess={fetchMembers}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search members by name or email..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/25 focus:bg-white/[0.07]"
        />
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
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Loading members...
          </div>
        </div>
      ) : filteredMembers.length === 0 ? (
        /* Empty state */
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5">
            <Users className="size-5 text-slate-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            No members found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:block">
            <div className="members-scrollbar max-h-[520px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md">
                  <tr className="border-b border-white/10">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Member
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-white/5 last:border-0">
                      {/* Member */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                            <User className="size-4 text-slate-400" />
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {member.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              ID #{member.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Mail className="size-4 text-slate-500" />

                          {member.email}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        {member.role === "LIBRARIAN" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-400/10 px-2.5 py-1 text-xs font-medium text-purple-300">
                            <Shield className="size-3.5" />
                            Librarian
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                            <User className="size-3.5" />
                            Member
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-sm text-slate-400">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <MemberHistoryDialog
                            member={member}
                          />

                          <EditMemberDialog
                            member={member}
                            onSuccess={fetchMembers}
                          />

                          <DeleteMemberDialog
                            member={member}
                            onSuccess={fetchMembers}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="members-scrollbar max-h-[600px] space-y-3 overflow-y-auto md:hidden">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <User className="size-4 text-slate-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{member.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID #{member.id}
                        </p>
                      </div>

                      {member.role === "LIBRARIAN" ? (
                        <span className="rounded-full bg-purple-400/10 px-2.5 py-1 text-xs font-medium text-purple-300">
                          Librarian
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                          Member
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                      <Mail className="size-4 text-slate-500" />

                      <span className="truncate">{member.email}</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Joined{" "}
                      {member.createdAt
                        ? new Date(member.createdAt).toLocaleDateString()
                        : "—"}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2 [&>button]:w-full">
                      <MemberHistoryDialog
                        member={member}
                      />

                      <EditMemberDialog
                        member={member}
                        onSuccess={fetchMembers}
                      />

                      <DeleteMemberDialog
                            member={member}
                            onSuccess={fetchMembers}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Members;