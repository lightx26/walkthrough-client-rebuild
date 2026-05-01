import axios from "axios";
import type { ErrorResponse } from "@/types/api";

/**
 * Extracts a user-friendly error message from an unknown error value.
 * For Axios errors, prefers the API's `message` field from the response body.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An error occurred",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined;
    return data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
