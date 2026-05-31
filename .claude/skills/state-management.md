# State Management

## Three Layers

| Layer           | Tool          | What it stores                           |
| --------------- | ------------- | ---------------------------------------- |
| **Global auth** | Redux Toolkit | `user`, `isAuthenticated`, `isLoading`   |
| **Server data** | React Query   | Repos, PRs, walkthroughs, commits, files |
| **Local UI**    | `useState`    | Form inputs, UI toggles, drag state      |

## Redux (Auth Only)

```
store/
├── index.ts           # configureStore, typed hooks
└── slices/
    └── auth.slice.ts  # { user, isAuthenticated, isLoading }
```

- Actions: `setCredentials(user)`, `logout()`
- Typed hooks: `useAppSelector`, `useAppDispatch`
- `isLoading` guards `AuthGuard` during session restore

## React Query

### Config (`providers/app-providers.tsx`)

- Default stale time: **5 minutes**
- Retry: **1 attempt**
- Global error handler: shows toast via Sonner

### Hook Pattern

```tsx
export function useWalkthroughs(owner: string, repo: string, prNumber: number) {
  return useQuery({
    queryKey: ['walkthroughs', owner, repo, prNumber],
    queryFn: () => walkthroughService.list(owner, repo, prNumber),
    enabled: !!owner && !!repo && !!prNumber,
  });
}
```

### Query Key Convention

```
["resource", ...identifiers]
["repositories", page, perPage, q]
["pullRequest", owner, repo, pullNumber]
["walkthroughs", owner, repo, prNumber]
```

### Mutations

```tsx
export function useCreateWalkthrough(owner, repo, prNumber) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request) => walkthroughService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['walkthroughs', owner, repo, prNumber],
      });
    },
  });
}
```

## When to Use What

- **Need auth state?** → Redux (`useAppSelector`)
- **Need server data?** → React Query hook (`useWalkthroughs`, `usePullRequest`)
- **Need form/UI state?** → `useState` in the component
- **Need derived data?** → `useMemo` from existing state

## Key Files

- `store/index.ts` — Redux store configuration
- `store/slices/auth.slice.ts` — auth reducer
- `providers/app-providers.tsx` — QueryClient config
- `hooks/use-github.ts` — query hooks reference
- `hooks/use-walkthrough.ts` — mutation hooks reference
