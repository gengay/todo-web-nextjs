import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  uid: string;
  title: string;
  description: string;
  priority: TodoPriority;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  dueAt: number | null;
}

export interface TodoInput {
  title: string;
  description: string;
  priority: TodoPriority;
  dueAt: number | null;
}

function todoCollection() {
  if (!db) {
    throw new Error("Firebase Firestore is not configured");
  }
  return collection(db, "tasks");
}

function timestampToMillis(value: unknown) {
  if (typeof value === "number") return value;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (
    value !== null &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }
  return 0;
}

function toTodo(id: string, uid: string, data: Record<string, unknown>): Todo {
  const rawPriority = data.priority;
  const priority: TodoPriority =
    rawPriority === "low" || rawPriority === "high" || rawPriority === "medium"
      ? rawPriority
      : "medium";
  const rawTitle = data.title ?? data.task ?? data.name;
  const rawDescription = data.description ?? data.detail;
  const rawCompleted = data.completed ?? data.isCompleted ?? data.done;

  return {
    id,
    uid: typeof data.userId === "string" ? data.userId : typeof data.uid === "string" ? data.uid : uid,
    title: typeof rawTitle === "string" ? rawTitle : "",
    description: typeof rawDescription === "string" ? rawDescription : "",
    priority,
    completed:
      typeof rawCompleted === "boolean"
        ? rawCompleted
        : data.status === "done" || data.status === "completed",
    createdAt: timestampToMillis(data.createdAt ?? data.created_at ?? data.timestamp),
    updatedAt: timestampToMillis(data.updatedAt ?? data.updated_at),
    dueAt: timestampToMillis(data.dueDate ?? data.dueAt) || null,
  };
}

export function subscribeToTodos(
  uid: string,
  onTodos: (todos: Todo[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const todosQuery = query(todoCollection(), where("userId", "==", uid));
  return onSnapshot(
    todosQuery,
    (snapshot) => {
      const todos = snapshot.docs
        .map((todoDocument) => toTodo(todoDocument.id, uid, todoDocument.data()))
        .sort((left, right) => right.createdAt - left.createdAt);
      onTodos(todos);
    },
    onError,
  );
}

export async function createTodo(uid: string, input: TodoInput) {
  await addDoc(todoCollection(), {
    userId: uid,
    title: input.title,
    description: input.description,
    priority: input.priority,
    dueDate: input.dueAt ? new Date(input.dueAt).toISOString() : null,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTodo(uid: string, id: string, input: Partial<TodoInput> & { completed?: boolean }) {
  if (!db || !uid) {
    throw new Error("Firebase Firestore is not configured");
  }
  const { dueAt, ...fields } = input;
  await updateDoc(doc(db, "tasks", id), {
    ...fields,
    ...(dueAt !== undefined
      ? { dueDate: dueAt ? new Date(dueAt).toISOString() : null }
      : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTodo(uid: string, id: string) {
  if (!db || !uid) {
    throw new Error("Firebase Firestore is not configured");
  }
  await deleteDoc(doc(db, "tasks", id));
}
