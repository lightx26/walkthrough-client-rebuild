# Component Patterns

## Coding Standards

- **Modularity:** 1 Component = 1 File. Use folder-based components if
  styles/types are complex.
- **Props:** Prefer composition (`children`) over deeply nested prop
  drilling.
- **DRY:** If you find yourself writing the same Tailwind classes twice,
  extract a shared component.
- **Component size:** Aim for components that are no more than 300 lines. If it grows larger, consider splitting it.

## Client Directive

All interactive components must include `"use client"` as the first line:

```tsx
'use client';

import { useState } from 'react';

// ...
```

## Props Interface

Define props interfaces in the same file, named `{ComponentName}Props`:

```tsx
interface PullRequestDetailProps {
  owner: string;
  repo: string;
  pullNumber: number;
}

export function PullRequestDetail({ owner, repo, pullNumber }: PullRequestDetailProps) { ... }
```

## Exports

- **Components**: named exports — `export function Button() {}`
- **Pages**: default export — `export default PullRequestPage`

## Barrel Files (index.ts)

Every component folder **must** have an `index.ts` barrel file that re-exports all public components. This keeps imports clean and decoupled from internal file structure.

```ts
// components/analytics/author/index.ts
export { AuthorView } from './author-view';
export { AuthorWalkthroughCard } from './author-walkthrough-card';
export { ProgressDots } from './progress-dots';
```

- Use named re-exports (`export { X } from "./x"`) — no default exports in barrel files.
- A parent folder's `index.ts` should re-export from its subfolders using `export * from "./subfolder"`.
- Consumers import from the folder path, never from individual files:

```tsx
// Good
import {
  AuthorView,
  TeamLeadView,
  AnalyticsTabButton,
} from "@/components/analytics";

// Bad
import { AuthorView } from "@/components/analytics/author/author-view";
```

## UI Component Stack

- **Base**: `@base-ui/react` headless primitives (Button, Input, Avatar)
- **Variants**: `class-variance-authority` (CVA) for component variant styling
- **Class merging**: `cn()` utility from `lib/utils.ts` — combines `clsx` + `tailwind-merge`
- **Icons**: `lucide-react` — sized with Tailwind `size-N` classes

```tsx
const buttonVariants = cva('base-classes...', {
  variants: {
    variant: { default: '...', outline: '...', ghost: '...' },
    size: { sm: '...', default: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

function Button({ className, variant, size, ...props }) {
  return (
    <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
```

## Loading States

- Use `Skeleton` components during data fetch
- React Query `isLoading` for conditional rendering
- Skeleton arrays for list loading: `Array.from({ length: 3 }).map(...)`

## Error States

- `getErrorMessage(error)` from `lib/error.ts` to extract message
- Toast: `toast.error(message)` via Sonner
- Inline: error card with destructive border/background

## Key Files

- `components/ui/button.tsx` — CVA pattern reference
- `components/ui/skeleton.tsx` — loading placeholder
- `lib/utils.ts` — `cn()` utility
- `lib/error.ts` — `getErrorMessage()`
