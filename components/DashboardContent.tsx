"use client";

import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import { TodoList } from "@/components/TodoList";
import { useTodos } from "@/components/useTodos";
import { todayLocalInput, toLocalDateInput } from "@/lib/date-time";

export function DashboardContent() {
  const { t } = useLanguage();
  const { todos } = useTodos();
  const [selectedDate, setSelectedDate] = useState(todayLocalInput);

  const selectedTodos = todos.filter(
    (todo) => toLocalDateInput(todo.dueAt ?? todo.createdAt) === selectedDate,
  );
  const completedCount = selectedTodos.filter((todo) => todo.completed).length;
  const pendingCount = selectedTodos.length - completedCount;

  return (
    <main>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("dashboard.title")}
        </h1>
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            {t("dashboard.selectDate")}
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <Link
            href="/tasks/new"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + {t("tasks.add")}
          </Link>
        </div>
      </div>

      <section aria-label={t("dashboard.title")} className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: t("dashboard.total"), value: selectedTodos.length, className: "bg-sky-100 dark:bg-sky-950/50" },
          { label: t("dashboard.done"), value: completedCount, className: "bg-emerald-100 dark:bg-emerald-950/50" },
          { label: t("dashboard.pending"), value: pendingCount, className: "bg-amber-100 dark:bg-amber-950/50" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl px-3 py-5 text-center sm:px-5 ${stat.className}`}>
            <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          {t("dashboard.tasksForDate")} · {selectedDate}
        </h2>
        <TodoList todos={selectedTodos} />
      </section>
    </main>
  );
}
