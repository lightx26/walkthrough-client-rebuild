"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthIsLoading, useIsAuthenticated } from "@/hooks/use-auth";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthIsLoading();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 flex min-h-0">{children}</div>
      </div>
    </div>
  );
}
