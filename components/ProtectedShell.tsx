"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/components/LanguageProvider";

const links = [
  { href: "/", key: "nav.dashboard" as const, icon: "▾" },
  { href: "/tasks", key: "nav.tasks" as const, icon: "☷" },
  { href: "/report", key: "nav.report" as const, icon: "▤" },
  { href: "/profile", key: "nav.profile" as const, icon: "◉" },
];

export function ProtectedShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <>
      <div className="mx-auto min-h-[calc(100vh-73px)] w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {children}
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto grid max-w-5xl grid-cols-4">
          {links.map(({ href, key, icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs transition ${
                  active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <span aria-hidden="true" className="text-xl leading-none">{icon}</span>
                <span>{t(key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
