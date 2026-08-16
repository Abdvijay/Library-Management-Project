import { apiRequest } from "./api";

import type { IssueRecord } from "../types";

export interface CreateIssueData {
  bookId: number;
  memberId: number;
  dueDate: string;
}

export const getIssues = async () => {
  const response = await apiRequest("/issues");

  return response.data as IssueRecord[];
};

export const getIssueById = async (id: number) => {
  const response = await apiRequest(`/issues/${id}`);

  return response.data as IssueRecord;
};

export const createIssue = async (issueData: CreateIssueData) => {
  return apiRequest("/issues", {
    method: "POST",
    body: JSON.stringify(issueData),
  });
};

export const returnBook = async (id: number) => {
  return apiRequest(`/issues/${id}/return`, {
    method: "PUT",
    body: JSON.stringify({}),
  });
};