"use client";

import { useMemo, useState } from "react";

import { TodoList } from "@/components/TodoList";
import { useLanguage } from "@/components/LanguageProvider";
import { useTodos } from "@/components/useTodos";
import { toLocalDateInput } from "@/lib/date-time";
import type { TodoPriority } from "@/lib/todos";

type StatusFilter = "all" | "done" | "pending";
type PriorityFilter = "all" | TodoPriority;

export function ReportContent() {
  const { t } = useLanguage();
  const { todos } = useTodos();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) => {
        const date = toLocalDateInput(todo.dueAt ?? todo.createdAt);
        return (
          (!fromDate || date >= fromDate) &&
          (!toDate || date <= toDate) &&
          (status === "all" || (status === "done" ? todo.completed : !todo.completed)) &&
          (priority === "all" || todo.priority === priority)
        );
      }),
    [fromDate, priority, status, toDate, todos],
  );

  const selectClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {t("report.title")}
      </h1>
      <section className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("report.from")}
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className={selectClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("report.to")}
          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className={selectClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("report.status")}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className={selectClass}
          >
            <option value="all">{t("report.all")}</option>
            <option value="done">{t("report.done")}</option>
            <option value="pending">{t("report.pending")}</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("report.priority")}
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as PriorityFilter)}
            className={selectClass}
          >
            <option value="all">{t("report.all")}</option>
            <option value="high">{t("task.high")}</option>
            <option value="medium">{t("task.medium")}</option>
            <option value="low">{t("task.low")}</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setFromDate("");
            setToDate("");
            setStatus("all");
            setPriority("all");
          }}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:col-span-2 lg:col-span-4"
        >
          {t("report.clear")}
        </button>
      </section>
      <TodoList todos={filteredTodos} emptyMessage={t("report.noResults")} />
    </main>
  );
}
