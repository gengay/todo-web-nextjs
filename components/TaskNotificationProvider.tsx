"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { toLocalDateInput } from "@/lib/date-time";
import { subscribeToTodos, type Todo } from "@/lib/todos";

type NotificationState = NotificationPermission | "unsupported";

interface TaskNotificationContextValue {
  permission: NotificationState;
  requestPermission: () => Promise<void>;
}

const TaskNotificationContext = createContext<TaskNotificationContextValue | null>(null);

export function TaskNotificationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [permission, setPermission] = useState<NotificationState>("default");
  const sentReminderKeys = useRef(new Set<string>());
  const permissionErrorShown = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") {
      setPermission("unsupported");
      toast.error(t("nav.notificationsUnsupported"));
      return;
    }

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);
      if (nextPermission === "granted") {
        toast.success(t("nav.notificationsEnabled"));
      } else if (nextPermission === "denied") {
        toast.error(t("nav.notificationsDenied"));
      }
    } catch (error) {
      console.error("Could not request notification permission", error);
      toast.error(t("nav.notificationsFailed"));
    }
  }, [t]);

  useEffect(() => {
    if (!user || permission !== "granted") return;

    const storageKey = `todoflow-reminders:${user.uid}`;
    const today = toLocalDateInput(Date.now());
    sentReminderKeys.current = new Set();
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          sentReminderKeys.current = new Set(
            parsed.filter(
              (key): key is string =>
                typeof key === "string" && key.endsWith(`:${today}`),
            ),
          );
        }
      }
    } catch (error) {
      console.error("Could not read sent task reminders", error);
    }

    let todos: Todo[] = [];
    const notifyUpcomingTasks = () => {
      const now = Date.now();
      const reminderDate = toLocalDateInput(now);
      for (const todo of todos) {
        if (todo.completed || todo.dueAt === null) continue;
        const timeUntilDue = todo.dueAt - now;
        if (timeUntilDue < 0 || timeUntilDue > 60 * 60 * 1000) continue;

        const reminderKey = `${todo.id}:${reminderDate}`;
        if (sentReminderKeys.current.has(reminderKey)) continue;

        try {
          const notification = new Notification(t("notifications.title"), {
            body: `${todo.title} · ${t("notifications.dueWithinHour")}`,
            tag: reminderKey,
          });
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
          sentReminderKeys.current.add(reminderKey);
          try {
            window.localStorage.setItem(
              storageKey,
              JSON.stringify(
                [...sentReminderKeys.current].filter((key) => key.endsWith(`:${reminderDate}`)),
              ),
            );
          } catch (error) {
            console.error("Could not save sent task reminders", error);
          }
        } catch (error) {
          console.error("Could not show a task reminder", error);
          if (!permissionErrorShown.current) {
            permissionErrorShown.current = true;
            toast.error(t("nav.notificationsFailed"));
          }
        }
      }
    };

    const unsubscribe = subscribeToTodos(
      user.uid,
      (nextTodos) => {
        todos = nextTodos;
        notifyUpcomingTasks();
      },
      (error) => {
        console.error("Could not monitor task reminders", error);
        toast.error(t("tasks.loadFailed"));
      },
    );
    const intervalId = window.setInterval(notifyUpcomingTasks, 30_000);

    return () => {
      unsubscribe();
      window.clearInterval(intervalId);
    };
  }, [permission, t, user]);

  return (
    <TaskNotificationContext.Provider value={{ permission, requestPermission }}>
      {children}
    </TaskNotificationContext.Provider>
  );
}

export function useTaskNotifications() {
  const value = useContext(TaskNotificationContext);
  if (!value) {
    throw new Error("useTaskNotifications must be used within TaskNotificationProvider");
  }
  return value;
}
