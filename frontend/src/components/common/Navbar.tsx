import {
  BookOpen,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  UserCircle,
  UserRound,
  Users,
  X,
} from "lucide-react";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            to={user?.role === "LIBRARIAN" ? "/dashboard" : "/my-dashboard"}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950 sm:size-10">
              <BookOpen className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white sm:text-base">
                LibraryHub
              </p>

              <p className="hidden text-xs text-slate-500 sm:block">
                Library Management System
              </p>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {/* User */}
          <div className="hidden items-center gap-2.5 sm:flex">
            <UserCircle className="size-5 shrink-0 text-slate-400" />

            <div className="min-w-0 text-right leading-tight">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name}
              </p>

              <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex size-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white sm:h-10 sm:w-auto sm:px-3"
            aria-label="Logout"
          >
            <LogOut className="size-4" />

            <span className="hidden text-sm sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/98 px-3 py-3 sm:px-4 lg:hidden">
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
        ]
      : [
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

  return (
    <nav className="grid grid-cols-2 gap-2">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            activeProps={{
              className:
                "flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-slate-950",
            }}
            inactiveProps={{
              className:
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white",
            }}
          >
            <Icon className="size-4 shrink-0" />

            <span className="truncate">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;