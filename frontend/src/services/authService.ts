import { apiRequest } from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (loginData: LoginData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(loginData),
  });
};

export const registerUser = async (registerData: RegisterData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(registerData),
  });
};