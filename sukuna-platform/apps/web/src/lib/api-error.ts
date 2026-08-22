/**
 * Shared client-side helper for turning an apiClient (axios) error into a
 * user-facing message. Understands the { success: false, error: { code,
 * message, details } } shape returned by apiHandler() (see api-handler.ts).
 */

interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: Array<{ message?: string }>;
}

interface AxiosLikeError {
  response?: {
    data?: {
      error?: ApiErrorBody;
    };
  };
}

export function getErrorMessage(err: unknown, fallback: string): string {
  const apiError = (err as AxiosLikeError)?.response?.data?.error;
  if (!apiError) return fallback;
  if (apiError.code === 'VALIDATION_ERROR' && Array.isArray(apiError.details) && apiError.details[0]?.message) {
    return apiError.details[0].message;
  }
  return apiError.message || fallback;
}
