"use client";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { auth } from "@/lib/firebase";

export function ProfileContent() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextDisplayName = displayName.trim();
    if (!user || !nextDisplayName) {
      toast.error(t("profile.nameRequired"));
      return;
    }
    if (nextDisplayName === user.displayName?.trim()) {
      setIsEditingProfile(false);
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile(user, { displayName: nextDisplayName });
      await refreshUser();
      setDisplayName(nextDisplayName);
      setIsEditingProfile(false);
      toast.success(t("profile.updated"));
    } catch (error) {
      console.error("Could not update profile", error);
      toast.error(t("profile.updateFailed"));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const cancelProfileUpdate = () => {
    setDisplayName(user?.displayName ?? "");
    setIsEditingProfile(false);
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.email) {
      toast.error(t("profile.passwordUnavailable"));
      return;
    }
    if (!user.providerData.some((provider) => provider.providerId === "password")) {
      toast.error(t("profile.passwordUnavailable"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("profile.passwordMinLength"));
      return;
    }
    if (currentPassword === newPassword) {
      toast.error(t("profile.passwordChangeFailed"));
      return;
    }

    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      toast.success(t("profile.passwordChanged"));
    } catch (error) {
      console.error("Could not change password", error);
      toast.error(t("profile.passwordChangeFailed"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) {
      toast.error(t("auth.firebaseNotConfigured"));
      return;
    }
    try {
      await signOut(auth);
      toast.success(t("auth.logoutSuccess"));
      router.replace("/login");
    } catch (error) {
      console.error("Could not log out", error);
      toast.error(t("common.error"));
    }
  };

  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {t("profile.title")}
      </h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("profile.name")}</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {user?.displayName || "—"}
            </p>
          </div>
          {!isEditingProfile ? (
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t("profile.edit")}
            </button>
          ) : null}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("profile.signedInAs")}</p>
        <p className="mt-1 break-all font-medium text-slate-900 dark:text-white">{user?.email}</p>
        {isEditingProfile ? (
          <form onSubmit={handleProfileUpdate} className="mt-5 space-y-3">
            <label htmlFor="profile-display-name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.displayName")}
            </label>
            <input
              id="profile-display-name"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={80}
              autoComplete="nickname"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingProfile ? t("profile.saving") : t("profile.save")}
              </button>
              <button
                type="button"
                onClick={cancelProfileUpdate}
                disabled={isSavingProfile}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t("profile.cancelEdit")}
              </button>
            </div>
          </form>
        ) : null}
      </section>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          {t("profile.changePassword")}
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("profile.currentPassword")}
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("profile.newPassword")}
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900"
            />
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChangingPassword ? t("profile.changingPassword") : t("profile.submitPasswordChange")}
          </button>
        </form>
      </section>
      <button
        type="button"
        onClick={() => void handleLogout()}
        className="mt-5 w-full rounded-2xl bg-rose-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-rose-700"
      >
        {t("auth.logout")}
      </button>
    </main>
  );
}
