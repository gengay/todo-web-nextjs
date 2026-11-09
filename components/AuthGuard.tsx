"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

export function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-slate-500 dark:text-slate-400">
        {loading ? t("tasks.loading") : t("auth.login")}
      </main>
    );
  }

  return children;
}
