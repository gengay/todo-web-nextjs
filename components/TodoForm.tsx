"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { createTodo, subscribeToTodos, updateTodo, type Todo, type TodoInput, type TodoPriority } from "@/lib/todos";
import { localDateTimeToMillis, toLocalDateInput, toLocalTimeInput } from "@/lib/date-time";

interface TodoFormProps {
  todoId?: string;
}

export function TodoForm({ todoId }: TodoFormProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(todoId));
  const [isSaving, setIsSaving] = useState(false);
  const [found, setFound] = useState(!todoId);

  useEffect(() => {
    if (!todoId || !user) return;
    return subscribeToTodos(
      user.uid,
      (todos: Todo[]) => {
        const todo = todos.find((item) => item.id === todoId);
        if (todo) {
          setTitle(todo.title);
          setDescription(todo.description);
          setPriority(todo.priority);
          setDueDate(todo.dueAt ? toLocalDateInput(todo.dueAt) : "");
          setDueTime(todo.dueAt ? toLocalTimeInput(todo.dueAt) : "");
          setFound(true);
        } else {
          setFound(false);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Could not load todo for editing", error);
        toast.error(t("tasks.loadFailed"));
        setIsLoading(false);
      },
    );
  }, [t, todoId, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const dueAt = localDateTimeToMillis(dueDate, dueTime);
    if ((dueDate && !dueTime) || (!dueDate && dueTime)) {
      toast.error(t("task.dueDateTimeRequired"));
      return;
    }
    const input: TodoInput = { title: title.trim(), description: description.trim(), priority, dueAt };
    if (!input.title) {
      toast.error(t("task.titleRequired"));
      return;
    }
    setIsSaving(true);
    try {
      if (todoId) {
        await updateTodo(user.uid, todoId, input);
      } else {
        await createTodo(user.uid, input);
      }
      toast.success(t("tasks.saveSuccess"));
      router.push("/tasks");
    } catch (error) {
      console.error("Could not save todo", error);
      toast.error(t("tasks.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="py-12 text-center text-slate-500 dark:text-slate-400">{t("tasks.loading")}</p>;
  }
  if (!found) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">{t("task.notFound")}</p>
        <Link href="/tasks" className="font-semibold text-indigo-600 dark:text-indigo-400">{t("task.back")}</Link>
      </div>
    );
  }

  const priorityOptions: { value: TodoPriority; label: string }[] = [
    { value: "low", label: t("task.low") },
    { value: "medium", label: t("task.medium") },
    { value: "high", label: t("task.high") },
  ];

  return (
    <main className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/tasks" aria-label={t("task.back")} className="text-2xl text-slate-600 dark:text-slate-300">←</Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {todoId ? t("task.manage") : t("task.new")}
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
        <div>
          <label htmlFor="todo-title" className="mb-2 block font-medium text-slate-800 dark:text-slate-200">
            {t("task.title")}
          </label>
          <input
            id="todo-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={160}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900"
          />
        </div>
        <div>
          <label htmlFor="todo-description" className="mb-2 block font-medium text-slate-800 dark:text-slate-200">
            {t("task.description")}
          </label>
          <textarea
            id="todo-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            maxLength={2000}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-900"
          />
        </div>
        <fieldset>
          <legend className="mb-2 font-medium text-slate-800 dark:text-slate-200">{t("task.dueDateTime")}</legend>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{t("task.dueDateTimeHelp")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label htmlFor="todo-due-date" className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("task.dueDate")}
              <input
                id="todo-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label htmlFor="todo-due-time" className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("task.dueTime")}
              <input
                id="todo-due-time"
                type="time"
                value={dueTime}
                onChange={(event) => setDueTime(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-medium text-slate-800 dark:text-slate-200">{t("task.priority")}</legend>
          <div className="grid grid-cols-3 gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={priority === option.value}
                onClick={() => setPriority(option.value)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  priority === option.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? t("task.saving") : t("task.save")}
        </button>
      </form>
    </main>
  );
}
