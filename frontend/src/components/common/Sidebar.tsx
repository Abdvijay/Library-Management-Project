import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  UserRound,
} from "lucide-react";

import { Link } from "@tanstack/react-router";

import { getUser } from "../../services/authStorage";

const Sidebar = () => {
  const user = getUser();

  const librarianLinks = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Books",
      to: "/books",
      icon: BookOpen,
    },
    {
      label: "Authors",
      to: "/authors",
      icon: Library,
    },
    {
      label: "Members",
      to: "/members",
      icon: Users,
    },
    {
      label: "Issues",
      to: "/issues",
      icon: BookOpen,
    },
  ];

  const memberLinks = [
    {
      label: "My Dashboard",
      to: "/my-dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Books",
      to: "/books",
      icon: BookOpen,
    },
    {
      label: "My Issues",
      to: "/my-issues",
      icon: BookOpen,
    },
    {
      label: "My Profile",
      to: "/profile",
      icon: UserRound,
    },
  ];

  const links = user?.role === "LIBRARIAN" ? librarianLinks : memberLinks;

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-52 shrink-0 border-r border-white/10 bg-slate-950 lg:block">
      <div className="sticky top-16 p-4">
        {/* Section heading */}
        <div className="mb-4 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Navigation
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{
                  className:
                    "group flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 shadow-sm",
                }}
                inactiveProps={{
                  className:
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.07] hover:text-white",
                }}
              >
                <Icon className="size-4 shrink-0 transition-transform group-hover:scale-105" />

                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;