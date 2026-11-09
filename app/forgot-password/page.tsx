"use client";

import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { useLanguage } from "@/components/LanguageProvider";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      toast.error(t("auth.firebaseNotConfigured"));
      return;
    }

    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast.success(t("auth.resetSent"));
    } catch (submitError) {
      console.error("Could not send password reset email", submitError);
      toast.error(t("auth.resetFailed"));
      setIsSent(false);
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
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{t("auth.resetPassword")}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.email")}
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
              placeholder="you@example.com"
              required
            />
          </div>

          {isSent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
              {t("auth.resetSent")}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {isSubmitting ? t("auth.sending") : t("auth.sendReset")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
          {t("task.back")}{" "}
          <Link href="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400">
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
