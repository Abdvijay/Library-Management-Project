import { apiRequest } from "./api";
import type { Member, IssueRecord } from "../types";

export const getMembers = async () => {
  const response = await apiRequest("/members");

  return response.data as Member[];
};

export const createMember = async (memberData: {
  name: string;
  email: string;
  password: string;
  role?: "MEMBER" | "LIBRARIAN";
}) => {
  return apiRequest("/members", {
    method: "POST",
    body: JSON.stringify(memberData),
  });
};

export const getMemberById = async (id: number) => {
  const response = await apiRequest(`/members/${id}`);

  return response.data as Member;
};

export const getMemberIssues = async (id: number) => {
  const response = await apiRequest(`/members/${id}/issues`);

  return response.data as IssueRecord[];
};

export const updateMember = async (
  id: number,
  memberData: {
    name: string;
    email: string;
  }
) => {
  return apiRequest(`/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(memberData),
  });
};

export const deleteMember = async (id: number) => {
  return apiRequest(`/members/${id}`, {
    method: "DELETE",
    body: JSON.stringify({}),
  });
};