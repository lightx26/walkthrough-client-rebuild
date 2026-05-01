"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setCredentials,
  logout as logoutAction,
} from "@/store/slices/auth.slice";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/error";

export function useLoginWithGitHub() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (code: string) => authService.loginWithGitHub(code),
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed. Please try again."));
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Always clear local state, even if the API call fails
      dispatch(logoutAction());
      router.push("/login");
    },
  });
}

export function useCurrentUser() {
  return useAppSelector((state) => state.auth.user);
}

export function useIsAuthenticated() {
  return useAppSelector((state) => state.auth.isAuthenticated);
}

export function useAuthIsLoading() {
  return useAppSelector((state) => state.auth.isLoading);
}
