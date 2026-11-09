"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/AuthProvider";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { LanguageProvider } from "@/components/LanguageProvider";
import { TaskNotificationProvider } from "@/components/TaskNotificationProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

function AppContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const { resolvedTheme } = useTheme();
  return (
    <LanguageProvider>
      <AuthProvider>
        <TaskNotificationProvider>
          <GlobalNavbar />
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme={resolvedTheme === "dark" ? "dark" : "light"}
          />
        </TaskNotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  );
}
