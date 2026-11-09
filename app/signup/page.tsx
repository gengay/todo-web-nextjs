"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useLanguage } from "@/components/LanguageProvider";
import { getAuthErrorKey } from "@/lib/auth-errors";
import { auth, googleProvider } from "@/lib/firebase";

export default function SignUpPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) {
      toast.error(t("auth.firebaseNotConfigured"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    setIsSubmitting(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(user, { displayName: displayName.trim() });
      toast.success(t("auth.signupSuccess"));
      router.replace("/");
    } catch (error) {
      console.error("Email signup failed", error);
      const errorKey = getAuthErrorKey(error, language);
      toast.error(errorKey ? t(errorKey) : t("auth.signupFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!auth) {
      toast.error(t("auth.firebaseNotConfigured"));
      return;
    }
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(t("auth.signupSuccess"));
      router.replace("/");
    } catch (error) {
      console.error("Google signup failed", error);
      const errorKey = getAuthErrorKey(error, language);
      toast.error(errorKey ? t(errorKey) : t("auth.signupFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40";

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-xl font-bold text-white">
            T
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-indigo-500">TodoFlow</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {t("auth.signup")}
          </h1>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.displayName")}
            </label>
            <input id="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={inputClass} autoComplete="name" required />
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.email")}
            </label>
            <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.password")}
            </label>
            <input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} minLength={6} required />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.confirmPassword")}
            </label>
            <input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} minLength={6} required />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? t("auth.creatingAccount") : t("auth.signup")}
          </button>
        </form>
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{t("auth.continueWith")}</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
        <button type="button" disabled={isSubmitting} onClick={() => void handleGoogleSignUp()} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900">
          <span aria-hidden="true" className="font-bold text-base text-blue-600">G</span>
          {t("auth.google")}
        </button>
        <p className="mt-7 text-center text-sm text-slate-600 dark:text-slate-300">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400">{t("auth.login")}</Link>
        </p>
      </div>
    </main>
  );
}
