import { apiRequest } from "./api";

export interface DashboardStats {
  totalBooks: number;
  totalAuthors: number;
  totalMembers: number;
  activeIssues: number;
  overdueIssues: number;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
}

export const getDashboardStats = async () => {
  const response = await apiRequest("/dashboard");
  return response.data as DashboardStats;
};