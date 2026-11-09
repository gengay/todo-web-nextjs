"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useLanguage } from "@/components/LanguageProvider";
import { getAuthErrorKey } from "@/lib/auth-errors";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) {
      toast.error(t("auth.firebaseNotConfigured"));
      return;
    }

    setIsSubmitting(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success(t("auth.loginSuccess"));
      router.replace("/");
    } catch (error) {
      console.error("Email login failed", error);
      const errorKey = getAuthErrorKey(error, language);
      toast.error(errorKey ? t(errorKey) : t("auth.loginFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error(t("auth.firebaseNotConfigured"));
      return;
    }
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(t("auth.loginSuccess"));
      router.replace("/");
    } catch (error) {
      console.error("Google login failed", error);
      const errorKey = getAuthErrorKey(error, language);
      toast.error(errorKey ? t(errorKey) : t("auth.loginFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
            T
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-indigo-500">TodoFlow</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {t("auth.login")}
          </h1>
        </div>
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
              required
            />
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {t("auth.rememberMe")}
            </label>
            <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
          </button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {t("auth.continueWith")}
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => void handleGoogleLogin()}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
        >
          <span aria-hidden="true" className="font-bold text-base text-blue-600">G</span>
          {t("auth.google")}
        </button>
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
          {t("auth.noAccount")}{" "}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            {t("auth.signup")}
          </Link>
        </p>
      </div>
    </main>
  );
}
