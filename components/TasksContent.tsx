"use client";

import Link from "next/link";

import { useLanguage } from "@/components/LanguageProvider";
import { TodoList } from "@/components/TodoList";
import { useTodos } from "@/components/useTodos";

export function TasksContent() {
  const { t } = useLanguage();
  const { todos } = useTodos();
  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <main>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("tasks.title")}
        </h1>
        <Link
          href="/tasks/new"
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + {t("tasks.add")}
        </Link>
      </div>
      <TodoList todos={pendingTodos} />
    </main>
  );
}
