"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { store } from "@/store";
import { useAppDispatch } from "@/store";
import { setCredentials, logout } from "@/store/slices/auth.slice";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/error";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // 401s are handled by the axios interceptor (session expiry toast + logout dispatch)
      if (axios.isAxiosError(error) && error.response?.status === 401) return;
      toast.error(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Skip if the mutation has its own onError handler
      if (mutation.options.onError) return;
      toast.error(getErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Restores the session on every page load by calling GET /auth/me.
// If the access_token cookie is valid, user is populated in Redux.
// If not, the refresh interceptor in axios automatically retries with the
// refresh_token cookie before giving up and redirecting to /login.
function SessionRestorer() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    // Skip session restore on auth pages — no cookies exist yet.
    if (pathname.startsWith("/auth/") || pathname === "/login") {
      dispatch(logout());
      return;
    }

    authService
      .getMe()
      .then((data) => dispatch(setCredentials(data.data)))
      .catch(() => dispatch(logout()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" />
        <SessionRestorer />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
