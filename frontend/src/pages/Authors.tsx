import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  User,
  Users,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { Author } from "../types";

import { getAuthors } from "../services/authorService";

import AddAuthorDialog from "../components/common/AddAuthorDialog";
import EditAuthorDialog from "../components/common/EditAuthorDialog";
import DeleteAuthorDialog from "../components/common/DeleteAuthorDialog";
import AuthorBooksDialog from "../components/common/AuthorBooksDialog";

const Authors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAuthors();

      setAuthors(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load authors.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const filteredAuthors = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return authors;
    }

    return authors.filter(
      (author) =>
        author.name.toLowerCase().includes(value) ||
        author.bio?.toLowerCase().includes(value),
    );
  }, [authors, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Library Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Authors
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage book authors and their information.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchAuthors}
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

          <AddAuthorDialog
            onSuccess={fetchAuthors}
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
          placeholder="Search authors by name or bio..."
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
            Loading authors...
          </div>
        </div>
      ) : filteredAuthors.length === 0 ? (
        /* Empty state */
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5">
            <Users className="size-5 text-slate-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            No authors found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {search
              ? "Try changing your search."
              : "No authors have been added yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Author
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Bio
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAuthors.map((author) => (
                    <tr
                      key={author.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      {/* Author */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                            <User className="size-4 text-slate-400" />
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {author.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              ID #{author.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Bio */}
                      <td className="max-w-xl px-5 py-4">
                        <p className="line-clamp-2 text-sm text-slate-400">
                          {author.bio || "No biography available."}
                        </p>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-sm text-slate-400">
                        {author.createdAt
                          ? new Date(author.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <AuthorBooksDialog
                            author={author}
                          />

                          <EditAuthorDialog
                            author={author}
                            onSuccess={fetchAuthors}
                          />

                          <DeleteAuthorDialog
                            author={author}
                            onSuccess={fetchAuthors}
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
          <div className="space-y-3 md:hidden">
            {filteredAuthors.map((author) => (
              <div
                key={author.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <User className="size-4 text-slate-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{author.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID #{author.id}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      {author.bio || "No biography available."}
                    </p>

                    <div className="flex justify-end gap-2">
                      <AuthorBooksDialog
                        author={author}
                      />

                      <EditAuthorDialog
                        author={author}
                        onSuccess={fetchAuthors}
                      />

                      <DeleteAuthorDialog
                        author={author}
                        onSuccess={fetchAuthors}
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

export default Authors;