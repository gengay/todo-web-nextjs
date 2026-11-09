"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { subscribeToTodos, type Todo } from "@/lib/todos";

export function useTodos() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    return subscribeToTodos(
      user.uid,
      (nextTodos) => {
        setTodos(nextTodos);
        setLoading(false);
      },
      (error) => {
        console.error("Could not load todos", error);
        toast.error(t("tasks.loadFailed"));
        setLoading(false);
      },
    );
  }, [t, user]);

  return { todos, loading };
}
