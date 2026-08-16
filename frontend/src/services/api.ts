import { getToken } from "./authStorage";

const API_URL = import.meta.env.VITE_API_URL;

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export const apiRequest = async (endpoint: string, options: ApiOptions = {},) => {
  const { auth = true, headers, ...requestOptions } = options;

  const token = getToken();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth && token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};