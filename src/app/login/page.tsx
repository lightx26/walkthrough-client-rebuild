"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github, Zap, Users, ShieldCheck } from "lucide-react";
import { useIsAuthenticated, useAuthIsLoading } from "@/hooks/use-auth";
import { Logo } from "@/components/ui";
import { Button } from "@/components/ui/button";

function handleGitHubLogin() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
  const scope = "read:user,user:email,repo";
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri ?? "")}&scope=${scope}`;
}

const features = [
  { icon: Zap, label: "Fast reviews" },
  { icon: Users, label: "Collaborative" },
  { icon: ShieldCheck, label: "Secure" },
];

export default function LoginPage() {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthIsLoading();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-1.5 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500" />

          <div className="px-10 pt-10 pb-8 flex flex-col items-center">
            <Logo size="lg" className="mb-5" />

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Walkthrough
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Code review, made collaborative
            </p>

            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Sign in to your account
              </h2>
              <p className="text-gray-400 text-sm">
                Connect via GitHub to get started
              </p>
            </div>

            <Button
              variant="secondary"
              size="cta"
              onClick={handleGitHubLogin}
              className="gap-2.5"
            >
              <Github className="w-5 h-5" />
              Sign in with GitHub
            </Button>

            <div className="grid grid-cols-3 gap-3 w-full mt-6">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <Icon
                    className="w-5 h-5 text-violet-500"
                    strokeWidth={1.75}
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-10 pb-8 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              By signing in, you agree to our{" "}
              <a href="#" className="text-violet-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-violet-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Walkthrough · Code Review &amp; Walkthrough Management
        </p>
      </div>
    </div>
  );
}
