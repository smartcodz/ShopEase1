import { api } from "./api";
import type {
  AuthSession,
  LoginInput,
  RegisterInput,
} from "../types/auth";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const { data } = await api.post<ApiResponse<AuthSession>>("/auth/login", {
    email: normalizeEmail(input.email),
    password: input.password,
  });
  return data.data;
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  const { data } = await api.post<ApiResponse<AuthSession>>("/auth/register", {
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
  });
  return data.data;
}
