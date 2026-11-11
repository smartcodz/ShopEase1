import axios from "axios";
import type { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_STORAGE_KEY = "shopease.access-token";

// TypeScript says this is a string, but it cannot check that .env really exists.
// So we check it ourselves and fail early with a helpful message.
if (!baseURL) {
  throw new Error(
    "VITE_API_URL is missing. Add it to your .env file and restart the dev server.",
  );
}

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000, // give up after 10 seconds
  headers: { Accept: "application/json" },
});

function getApiErrorMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;

  const body = data as { message?: unknown; errors?: unknown };
  if (Array.isArray(body.errors)) {
    const messages = body.errors
      .map((error) =>
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: unknown }).message
          : null,
      )
      .filter((message): message is string => typeof message === "string");

    if (messages.length > 0) return messages.join(" ");
  }

  return typeof body.message === "string" ? body.message : null;
}

// Admin endpoints require the JWT returned by /auth/login or /auth/register.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turns any error into a short, friendly sentence (without a final period).
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const message = getApiErrorMessage(error.response.data);
      if (message !== null) return message;
      return `Request failed with status ${error.response.status}`;
    }
    if (error.code === "ECONNABORTED") {
      return "The server took too long to respond";
    }
    return "Cannot reach the server";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

// True only when the server answered "404 Not Found".
export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
