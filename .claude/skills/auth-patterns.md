# Authentication Patterns

## OAuth Flow

```
1. User clicks "Sign in with GitHub" → LoginButton
2. Generates random state, saves to sessionStorage
3. Redirects to github.com/login/oauth/authorize
4. GitHub redirects to /auth/callback with code + state
5. Callback validates state from sessionStorage
6. Sends code to POST /v1/auth/github via useLoginWithGitHub()
7. Server sets httpOnly cookies, returns user info
8. Client stores user in Redux → redirects to home
```

## Session Restore

`SessionRestorer` component (in `providers/app-providers.tsx`):

- Runs on mount: calls `GET /v1/auth/me`
- Skips on auth pages (`/login`, `/auth/*`)
- Success → dispatches `setCredentials(user)`
- 401 → axios interceptor tries `POST /v1/auth/refresh`
- Refresh fails → dispatches `logout()`, AuthGuard redirects to `/login`

## AuthGuard

Wraps all protected pages:

```tsx
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

- Shows loading spinner while `isLoading` (session restore in progress)
- Redirects to `/login` if `!isAuthenticated` after loading completes
- All pages under `/repos/` use AuthGuard

## Auth Hooks (`hooks/use-auth.ts`)

| Hook                   | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `useIsAuthenticated()` | Boolean — is user logged in                      |
| `useAuthIsLoading()`   | Boolean — is session restore in progress         |
| `useCurrentUser()`     | Returns `User \| null`                           |
| `useLoginWithGitHub()` | Mutation — sends OAuth code to server            |
| `useLogout()`          | Mutation — calls `/v1/auth/logout`, clears Redux |

## Important: Client Never Touches Tokens

- Access token and refresh token are **httpOnly cookies** set by the server
- Client only knows about user info (from Redux)
- `withCredentials: true` on axios sends cookies automatically
- No token in localStorage, no token in JavaScript memory

## Key Files

- `components/auth/auth-guard.tsx`
- `components/auth/login-button.tsx`
- `app/auth/callback/page.tsx`
- `hooks/use-auth.ts`
- `services/auth.service.ts`
- `store/slices/auth.slice.ts`
- `providers/app-providers.tsx` (SessionRestorer)
