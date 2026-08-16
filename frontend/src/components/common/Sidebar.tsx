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
      label: "My Profile",
      to: "/profile",
      icon: UserRound,
    },
  ];

  const links = user?.role === "LIBRARIAN" ? librarianLinks : memberLinks;

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-white/10 bg-slate-950 lg:block">
      <div className="sticky top-16 p-4">
        <div className="mb-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{
                  className: "bg-white text-slate-950",
                }}
                inactiveProps={{
                  className:
                    "text-slate-400 hover:bg-white/10 hover:text-white",
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
              >
                <Icon className="size-4" />

                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;