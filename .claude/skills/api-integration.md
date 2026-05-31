# API Integration

## Axios Client (`lib/axios.ts`)

```tsx
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // sends httpOnly cookies
});
```

### 401 Interceptor

- On 401 response → attempts `POST /v1/auth/refresh`
- Queues concurrent requests during refresh to prevent race conditions
- On refresh success → retries original request
- On refresh failure → dispatches `logout()`, redirects to `/login`

## Service Layer

One file per API domain in `services/`:

```tsx
// services/github.service.ts
export const githubService = {
  async getPullRequests(
    owner,
    repo,
    state,
    page,
    perPage
  ): Promise<DataResponse<ListData<PullRequest>>> {
    const { data } = await apiClient.get<DataResponse<ListData<PullRequest>>>(
      `/v1/github/repos/${owner}/${repo}/pulls`,
      { params: { state, page, perPage } }
    );
    return data;
  },
};
```

**Rules:**

- Plain async functions (no React hooks)
- Returns typed `DataResponse<T>` from the server
- Uses path variables for resource hierarchy, query params for filters
- Generic type on `apiClient.get<T>()` for response typing

## Type Definitions

```
types/
├── api/
│   └── index.ts         # DataResponse, ListData, PageData, SliceData, ErrorResponse
├── auth.ts              # User
├── github.ts            # Repository, PullRequest, Commit, FileChange
└── walkthrough.ts       # Walkthrough, Chapter, WalkthroughFile, Annotation + builder types
```

## Error Handling (`lib/error.ts`)

```tsx
export function getErrorMessage(error: unknown, fallback?: string): string {
  // Priority: error.response.data.message → error.message → fallback
}
```

Used by React Query global error handler and in components for inline errors.

## Key Files

- `lib/axios.ts` — axios instance with interceptors
- `lib/error.ts` — error message extraction
- `services/auth.service.ts`, `github.service.ts`, `walkthrough.service.ts`
- `types/api/index.ts` — API response types
