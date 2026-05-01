# Project Structure

## Directory Layout (example)

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            #   Home — repository list
│   ├── login/              #   Login page
│   ├── auth/callback/      #   OAuth callback handler
│   └── repos/[owner]/[repo]/
│       └── pulls/
│           ├── page.tsx                    # PR list
│           └── [number]/
│               ├── page.tsx                # PR detail (diff viewer)
│               └── walkthrough/
│                   ├── new/page.tsx         # Create walkthrough
│                   └── [walkthroughId]/page.tsx  # View walkthrough
├── components/
│   ├── ui/                 # Base UI components (Button, Badge, Input, etc.)
│   ├── auth/               # AuthGuard, LoginButton, SessionRestorer
│   ├── layout/             # Header
│   ├── github/             # GitHub-related features
│   │   ├── diff/           #   FileDiff, DiffTable, DiffCodeRow
│   │   ├── pr/             #   PullRequestCard, PullRequestList
│   │   ├── pr-details/     #   PullRequestDetail, CommitList, FileExplorerSidebar
│   │   └── repo/           #   RepositoryCard, RepositoryList
│   └── walkthrough/        # Walkthrough builder and preview
├── hooks/                  # Custom React hooks (use-auth, use-github, etc.)
├── services/               # API service layer (auth.service, github.service, etc.)
├── types/                  # TypeScript interfaces
│   └── api/                #   API response wrappers (DataResponse, ListData, etc.)
├── lib/                    # Core utilities (axios client, error helpers, cn)
├── utils/                  # Domain utilities (file-tree, diff-types, date-diff)
├── store/                  # Redux store and slices
│   └── slices/             #   auth.slice.ts
├── providers/              # App providers (Redux, React Query, Toast, SessionRestorer)
├── constants/              # Application constants
└── assets/                 # Static assets (icons)
```

## File Naming

- **Files**: kebab-case — `use-auth.ts`, `github.service.ts`, `diff-code-row.tsx`
- **Component exports**: PascalCase — `export function PullRequestDetail()`
- **Directories**: kebab-case — `pr-details/`, `walkthrough/`

## Page Convention

- App Router pages in `app/` with `page.tsx` files
- Dynamic params via `use(params)` (React 19 pattern)
- All protected pages wrapped in `AuthGuard`
- Breadcrumb navigation at top of each page
- Pages use default export; components use named export
