import { BookOpen, LogOut, Menu, UserCircle } from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "@tanstack/react-router";

import { clearAuth, getUser } from "../../services/authStorage";

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = getUser();

  const handleLogout = () => {
    clearAuth();

    navigate({
      to: "/login",
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link
            to={user?.role === "LIBRARIAN" ? "/dashboard" : "/my-dashboard"}
            className="flex items-center gap-3"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-white text-slate-950">
              <BookOpen className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold">LibraryHub</p>

              <p className="hidden text-xs text-slate-500 sm:block">
                Library Management System
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <UserCircle className="size-5 text-slate-400" />

            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>

              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />

            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <MobileNavigation
            role={user?.role}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}
    </header>
  );
};

interface MobileNavigationProps {
  role?: "LIBRARIAN" | "MEMBER";
  onNavigate: () => void;
}

const MobileNavigation = ({ role, onNavigate }: MobileNavigationProps) => {
  const links =
    role === "LIBRARIAN"
      ? [
          {
            label: "Dashboard",
            to: "/dashboard",
          },
          {
            label: "Books",
            to: "/books",
          },
          {
            label: "Authors",
            to: "/authors",
          },
          {
            label: "Members",
            to: "/members",
          },
          {
            label: "Issues",
            to: "/issues",
          },
        ]
      : [
          {
            label: "My Dashboard",
            to: "/my-dashboard",
          },
          {
            label: "Books",
            to: "/books",
          },
        ];

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;