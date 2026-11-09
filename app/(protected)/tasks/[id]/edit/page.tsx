import { TodoForm } from "@/components/TodoForm";

export const instant = false;

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TodoForm todoId={id} />;
}
