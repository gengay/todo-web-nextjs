"use client";

import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { deleteTodo, updateTodo, type Todo } from "@/lib/todos";

const priorityClasses = {
  low: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",
  medium: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  high: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30",
};

interface TodoListProps {
  todos: Todo[];
  limit?: number;
  emptyMessage?: string;
}

export function TodoList({ todos, limit, emptyMessage }: TodoListProps) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const visibleTodos = limit ? todos.slice(0, limit) : todos;

  const toggleCompleted = async (todo: Todo) => {
    if (!user) return;
    try {
      await updateTodo(user.uid, todo.id, { completed: !todo.completed });
    } catch (error) {
      console.error("Could not update todo status", error);
      toast.error(t("tasks.updateFailed"));
    }
  };

  const removeTodo = async (todo: Todo) => {
    if (!user || !window.confirm(t("tasks.deleteConfirm"))) return;
    try {
      await deleteTodo(user.uid, todo.id);
      toast.success(t("tasks.deleteSuccess"));
    } catch (error) {
      console.error("Could not delete todo", error);
      toast.error(t("tasks.deleteFailed"));
    }
  };

  if (!visibleTodos.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {emptyMessage ?? t("tasks.empty")}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {visibleTodos.map((todo) => (
        <li
          key={todo.id}
          className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
            todo.priority === "high" && !todo.completed
              ? "animate-pulse border-rose-500 bg-rose-50 shadow-lg shadow-rose-500/20 ring-2 ring-rose-400/70 motion-reduce:animate-none dark:border-rose-500 dark:bg-rose-950/40 dark:shadow-rose-950/50 dark:ring-rose-500/70"
              : todo.completed
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="min-w-0">
            <p className={`wrap-break-word font-semibold ${todo.completed ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
              {todo.title}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span
                className={`mr-2 inline-flex rounded-full border px-2 py-0.5 text-xs ${priorityClasses[todo.priority]} ${
                  todo.priority === "high" && !todo.completed
                    ? "animate-pulse shadow-sm shadow-rose-400/50 motion-reduce:animate-none"
                    : ""
                }`}
              >
                {t(`task.${todo.priority}`)}
              </span>
              {todo.dueAt ? (
                <span>{new Date(todo.dueAt).toLocaleString(language === "TH" ? "th-TH" : "en-US")}</span>
              ) : null}
              {" · "}
              {todo.completed ? t("dashboard.done") : t("dashboard.pending")}
            </p>
            {todo.description ? (
              <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm text-slate-600 dark:text-slate-300">
                {todo.description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleCompleted(todo)}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {todo.completed ? t("tasks.markPending") : t("tasks.markDone")}
            </button>
            <Link
              href={`/tasks/${todo.id}/edit`}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t("tasks.edit")}
            </Link>
            <button
              type="button"
              onClick={() => void removeTodo(todo)}
              aria-label={`${t("tasks.delete")}: ${todo.title}`}
              className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
            >
              {t("tasks.delete")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
