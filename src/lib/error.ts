import type { ErrorResponse } from '@/types/api';
import axios from 'axios';

/**
 * Extracts a user-friendly error message from an unknown error value.
 * For Axios errors, prefers the API's `message` field from the response body.
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined;
    return data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function getErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined;
    return data?.errorCode;
  }
  return undefined;
}

export function isHttpStatusError(error: unknown, status: number): boolean {
  return axios.isAxiosError(error) && error.response?.status === status;
}

export function isNotFoundError(error: unknown): boolean {
  return isHttpStatusError(error, 404);
}

export function isPublishValidationError(error: unknown): boolean {
  return getErrorCode(error) === 'WALKTHROUGH_INVALID_FOR_PUBLISH';
}
