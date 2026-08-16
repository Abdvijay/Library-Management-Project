import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MyDashboard from "./pages/MyDashboard";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import Members from "./pages/Members";
import Issues from "./pages/Issues";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/common/AppLayout";

const rootRoute = createRootRoute();

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const myDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-dashboard",
  component: () => (
    <ProtectedRoute allowedRoles={["MEMBER"]}>
      <AppLayout>
        <MyDashboard />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const booksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books",
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <Books />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const authorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/authors",
  component: () => (
    <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
      <AppLayout>
        <Authors />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const membersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/members",
  component: () => (
    <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
      <AppLayout>
        <Members />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const issuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issues",
  component: () => (
    <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
      <AppLayout>
        <Issues />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <ProtectedRoute allowedRoles={["MEMBER"]}>
      <AppLayout>
        <Profile />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  myDashboardRoute,
  booksRoute,
  authorsRoute,
  membersRoute,
  issuesRoute,
  profileRoute,
]);

export const router = createRouter({
  routeTree,
});