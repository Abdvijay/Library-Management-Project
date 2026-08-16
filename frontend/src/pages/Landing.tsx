import { BookOpen, Library, LogIn, UserPlus } from "lucide-react";

import { Link } from "@tanstack/react-router";

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-950">
                            <Library className="size-5" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold">LibraryHub</h1>

                            <p className="hidden text-xs text-slate-400 sm:block">Library Management System</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <LogIn className="size-4" />
                            <span className="hidden sm:inline">Login</span>
                        </Link>

                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            <UserPlus className="size-4" />
                            <span className="hidden sm:inline">Register</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main>
                <section className="relative overflow-hidden">
                    <div className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
                        {/* Content */}
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
                                <BookOpen className="size-4" />
                                Smart Library Management
                            </div>

                            <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                Manage your library
                                <span className="block text-slate-400">simply and efficiently.</span>
                            </h2>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                                Manage books, authors, members, and borrowing activities from one simple platform.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                                >
                                    <LogIn className="size-4" />
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    <UserPlus className="size-4" />
                                    Create Account
                                </Link>
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="hidden lg:block">
                            <div className="relative mx-auto max-w-md">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                                    <div className="mb-8 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Library Overview</p>

                                            <p className="mt-1 text-2xl font-bold">Welcome</p>
                                        </div>

                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                                            <BookOpen className="size-6" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                            <p className="text-2xl font-bold">Books</p>
                                            <p className="mt-1 text-sm text-slate-400">Manage collection</p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                            <p className="text-2xl font-bold">Authors</p>
                                            <p className="mt-1 text-sm text-slate-400">Organize authors</p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                            <p className="text-2xl font-bold">Members</p>
                                            <p className="mt-1 text-sm text-slate-400">Manage members</p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                            <p className="text-2xl font-bold">Issues</p>
                                            <p className="mt-1 text-sm text-slate-400">Track borrowing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Landing;