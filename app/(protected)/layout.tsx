import { AuthGuard } from "@/components/AuthGuard";
import { ProtectedShell } from "@/components/ProtectedShell";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <ProtectedShell>{children}</ProtectedShell>
    </AuthGuard>
  );
}
