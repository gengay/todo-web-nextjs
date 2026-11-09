"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

export type Language = "TH" | "EN";

const translations = {
  TH: {
    "nav.dashboard": "ภาพรวม",
    "nav.tasks": "งาน",
    "nav.report": "รายงาน",
    "nav.profile": "โปรไฟล์",
    "nav.switchLanguage": "เปลี่ยนภาษา",
    "nav.toggleTheme": "เปลี่ยนธีม",
    "nav.enableNotifications": "เปิดการแจ้งเตือนงาน",
    "nav.notificationsEnabled": "เปิดแจ้งเตือนแล้ว",
    "nav.notificationsDenied": "เบราว์เซอร์ปฏิเสธการแจ้งเตือน",
    "nav.notificationsUnsupported": "เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน",
    "nav.notificationsFailed": "เปิดการแจ้งเตือนไม่สำเร็จ",
    "notifications.title": "ใกล้ถึงกำหนดงาน",
    "notifications.dueWithinHour": "ถึงกำหนดภายใน 1 ชั่วโมง",
    "auth.login": "เข้าสู่ระบบ",
    "auth.signup": "สมัครสมาชิก",
    "auth.logout": "ออกจากระบบ",
    "auth.email": "อีเมล",
    "auth.password": "รหัสผ่าน",
    "auth.displayName": "ชื่อที่แสดง",
    "auth.confirmPassword": "ยืนยันรหัสผ่าน",
    "auth.rememberMe": "จดจำฉัน",
    "auth.forgotPassword": "ลืมรหัสผ่าน",
    "auth.google": "เข้าสู่ระบบด้วย Google",
    "auth.continueWith": "หรือดำเนินการต่อด้วย",
    "auth.noAccount": "ยังไม่มีบัญชีใช่ไหม?",
    "auth.haveAccount": "มีบัญชีอยู่แล้ว?",
    "auth.resetPassword": "ตั้งรหัสผ่านใหม่",
    "auth.sendReset": "ส่งลิงก์รีเซ็ตรหัสผ่าน",
    "auth.sending": "กำลังส่งลิงก์...",
    "auth.resetSent": "ส่งลิงก์ไปยังอีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย",
    "auth.loggingIn": "กำลังเข้าสู่ระบบ...",
    "auth.creatingAccount": "กำลังสร้างบัญชี...",
    "auth.firebaseNotConfigured": "ยังไม่ได้ตั้งค่า Firebase กรุณาตรวจสอบ environment variables",
    "auth.passwordMismatch": "รหัสผ่านและการยืนยันไม่ตรงกัน",
    "auth.loginSuccess": "เข้าสู่ระบบสำเร็จ",
    "auth.signupSuccess": "สร้างบัญชีสำเร็จ",
    "auth.logoutSuccess": "ออกจากระบบแล้ว",
    "auth.loginFailed": "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน",
    "auth.signupFailed": "สร้างบัญชีไม่สำเร็จ กรุณาลองอีกครั้ง",
    "auth.resetFailed": "ส่งลิงก์รีเซ็ตรหัสผ่านไม่สำเร็จ",
    "auth.emailInUse": "อีเมลนี้ถูกใช้สมัครแล้ว",
    "auth.weakPassword": "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
    "auth.invalidCredentials": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    "auth.popupClosed": "ปิดหน้าต่างเข้าสู่ระบบก่อนดำเนินการเสร็จ",
    "dashboard.title": "ภาพรวม",
    "dashboard.total": "งานทั้งหมด",
    "dashboard.done": "เสร็จแล้ว",
    "dashboard.pending": "กำลังทำ",
    "dashboard.highPriority": "งานสำคัญ",
    "dashboard.empty": "ยังไม่มีงาน เริ่มเพิ่มงานแรกของคุณได้เลย",
    "dashboard.selectDate": "เลือกวันที่",
    "dashboard.tasksForDate": "งานในวันที่เลือก",
    "tasks.title": "งานของฉัน",
    "tasks.add": "เพิ่มงาน",
    "tasks.empty": "ยังไม่มีงานในรายการ",
    "tasks.loading": "กำลังโหลดงาน...",
    "tasks.delete": "ลบ",
    "tasks.edit": "แก้ไข",
    "tasks.markDone": "เสร็จแล้ว",
    "tasks.markPending": "ทำต่อ",
    "tasks.deleteConfirm": "ต้องการลบงานนี้หรือไม่?",
    "tasks.loadFailed": "โหลดงานไม่สำเร็จ",
    "tasks.saveSuccess": "บันทึกงานสำเร็จ",
    "tasks.saveFailed": "บันทึกงานไม่สำเร็จ",
    "tasks.deleteSuccess": "ลบงานแล้ว",
    "tasks.deleteFailed": "ลบงานไม่สำเร็จ",
    "tasks.updateFailed": "อัปเดตสถานะไม่สำเร็จ",
    "task.manage": "จัดการงาน",
    "task.new": "เพิ่มงานใหม่",
    "task.title": "ชื่องาน",
    "task.description": "รายละเอียด",
    "task.dueDateTime": "กำหนดวันและเวลา",
    "task.dueDateTimeHelp": "ระบุทั้งวันที่และเวลาเพื่อรับการแจ้งเตือนล่วงหน้า 1 ชั่วโมง",
    "task.dueDate": "วันที่",
    "task.dueTime": "เวลา",
    "task.dueDateTimeRequired": "กรุณาระบุทั้งวันที่และเวลา หรือเว้นว่างทั้งคู่",
    "task.priority": "ความสำคัญ",
    "task.low": "ต่ำ",
    "task.medium": "ปานกลาง",
    "task.high": "สูง",
    "task.save": "บันทึกงาน",
    "task.saving": "กำลังบันทึก...",
    "task.titleRequired": "กรุณากรอกชื่องาน",
    "task.notFound": "ไม่พบงานนี้",
    "task.back": "กลับ",
    "profile.title": "โปรไฟล์",
    "profile.signedInAs": "เข้าสู่ระบบด้วย",
    "profile.name": "ชื่อ",
    "profile.edit": "แก้ไขโปรไฟล์",
    "profile.save": "บันทึกโปรไฟล์",
    "profile.saving": "กำลังบันทึก...",
    "profile.cancelEdit": "ยกเลิก",
    "profile.nameRequired": "กรุณากรอกชื่อที่ต้องการแสดง",
    "profile.updated": "อัปเดตโปรไฟล์แล้ว",
    "profile.updateFailed": "อัปเดตโปรไฟล์ไม่สำเร็จ",
    "profile.changePassword": "เปลี่ยนรหัสผ่าน",
    "profile.currentPassword": "รหัสผ่านปัจจุบัน",
    "profile.newPassword": "รหัสผ่านใหม่",
    "profile.passwordMinLength": "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร",
    "profile.passwordChanged": "เปลี่ยนรหัสผ่านสำเร็จ",
    "profile.passwordChangeFailed": "เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาตรวจสอบรหัสผ่านปัจจุบัน",
    "profile.passwordUnavailable": "การเปลี่ยนรหัสผ่านใช้ได้เฉพาะบัญชีอีเมลและรหัสผ่าน",
    "profile.changingPassword": "กำลังเปลี่ยนรหัสผ่าน...",
    "profile.submitPasswordChange": "บันทึกรหัสผ่านใหม่",
    "report.title": "รายงานงาน",
    "report.from": "ตั้งแต่วันที่",
    "report.to": "ถึงวันที่",
    "report.status": "สถานะ",
    "report.priority": "ความสำคัญ",
    "report.all": "ทั้งหมด",
    "report.done": "เสร็จแล้ว",
    "report.pending": "ยังไม่เสร็จ",
    "report.noResults": "ไม่พบงานตามตัวกรอง",
    "report.clear": "ล้างตัวกรอง",
    "common.error": "เกิดข้อผิดพลาด",
    "common.retry": "ลองอีกครั้ง",
    "common.cancel": "ยกเลิก",
  },
  EN: {
    "nav.dashboard": "Dashboard",
    "nav.tasks": "Tasks",
    "nav.report": "Report",
    "nav.profile": "Profile",
    "nav.switchLanguage": "Switch language",
    "nav.toggleTheme": "Toggle theme",
    "nav.enableNotifications": "Enable task notifications",
    "nav.notificationsEnabled": "Notifications enabled",
    "nav.notificationsDenied": "The browser denied notifications",
    "nav.notificationsUnsupported": "This browser does not support notifications",
    "nav.notificationsFailed": "Could not enable notifications",
    "notifications.title": "Task deadline approaching",
    "notifications.dueWithinHour": "Due within one hour",
    "auth.login": "Log in",
    "auth.signup": "Sign up",
    "auth.logout": "Log out",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.displayName": "Display name",
    "auth.confirmPassword": "Confirm password",
    "auth.rememberMe": "Remember me",
    "auth.forgotPassword": "Forgot password?",
    "auth.google": "Continue with Google",
    "auth.continueWith": "Or continue with",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.resetPassword": "Reset password",
    "auth.sendReset": "Send reset link",
    "auth.sending": "Sending link...",
    "auth.resetSent": "Reset link sent. Check your inbox.",
    "auth.loggingIn": "Logging in...",
    "auth.creatingAccount": "Creating account...",
    "auth.firebaseNotConfigured": "Firebase is not configured. Check your environment variables.",
    "auth.passwordMismatch": "Passwords do not match.",
    "auth.loginSuccess": "Logged in successfully",
    "auth.signupSuccess": "Account created successfully",
    "auth.logoutSuccess": "Logged out",
    "auth.loginFailed": "Login failed. Check your email and password.",
    "auth.signupFailed": "Could not create account. Please try again.",
    "auth.resetFailed": "Could not send the password reset link.",
    "auth.emailInUse": "This email is already in use.",
    "auth.weakPassword": "Password must be at least 6 characters.",
    "auth.invalidCredentials": "Email or password is incorrect.",
    "auth.popupClosed": "The sign-in window was closed before completing sign-in.",
    "dashboard.title": "Dashboard",
    "dashboard.total": "Total",
    "dashboard.done": "Done",
    "dashboard.pending": "Pending",
    "dashboard.highPriority": "High Priority",
    "dashboard.empty": "No tasks yet. Add your first task.",
    "dashboard.selectDate": "Choose date",
    "dashboard.tasksForDate": "Tasks for selected date",
    "tasks.title": "My Tasks",
    "tasks.add": "Add task",
    "tasks.empty": "No tasks in your list.",
    "tasks.loading": "Loading tasks...",
    "tasks.delete": "Delete",
    "tasks.edit": "Edit",
    "tasks.markDone": "Done",
    "tasks.markPending": "Reopen",
    "tasks.deleteConfirm": "Delete this task?",
    "tasks.loadFailed": "Could not load tasks.",
    "tasks.saveSuccess": "Task saved",
    "tasks.saveFailed": "Could not save task.",
    "tasks.deleteSuccess": "Task deleted",
    "tasks.deleteFailed": "Could not delete task.",
    "tasks.updateFailed": "Could not update task status.",
    "task.manage": "Manage task",
    "task.new": "New task",
    "task.title": "Task title",
    "task.description": "Description",
    "task.dueDateTime": "Due date and time",
    "task.dueDateTimeHelp": "Set both a date and time to receive a reminder one hour before the deadline.",
    "task.dueDate": "Due date",
    "task.dueTime": "Due time",
    "task.dueDateTimeRequired": "Enter both a date and time, or leave both empty.",
    "task.priority": "Priority",
    "task.low": "Low",
    "task.medium": "Medium",
    "task.high": "High",
    "task.save": "Save task",
    "task.saving": "Saving...",
    "task.titleRequired": "Please enter a task title.",
    "task.notFound": "Task not found.",
    "task.back": "Back",
    "profile.title": "Profile",
    "profile.signedInAs": "Signed in as",
    "profile.name": "Name",
    "profile.edit": "Edit profile",
    "profile.save": "Save profile",
    "profile.saving": "Saving...",
    "profile.cancelEdit": "Cancel",
    "profile.nameRequired": "Enter a display name.",
    "profile.updated": "Profile updated.",
    "profile.updateFailed": "Could not update your profile.",
    "profile.changePassword": "Change password",
    "profile.currentPassword": "Current password",
    "profile.newPassword": "New password",
    "profile.passwordMinLength": "The new password must be at least 6 characters.",
    "profile.passwordChanged": "Password changed successfully.",
    "profile.passwordChangeFailed": "Could not change password. Check your current password.",
    "profile.passwordUnavailable": "Password changes are only available for email and password accounts.",
    "profile.changingPassword": "Changing password...",
    "profile.submitPasswordChange": "Save new password",
    "report.title": "Task report",
    "report.from": "From",
    "report.to": "To",
    "report.status": "Status",
    "report.priority": "Priority",
    "report.all": "All",
    "report.done": "Done",
    "report.pending": "Pending",
    "report.noResults": "No tasks match these filters.",
    "report.clear": "Clear filters",
    "common.error": "Something went wrong.",
    "common.retry": "Try again",
    "common.cancel": "Cancel",
  },
} as const;

type TranslationKey = keyof typeof translations.EN;

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = (): Language =>
  typeof window !== "undefined" && window.localStorage.getItem("todoflow-language") === "EN"
    ? "EN"
    : "TH";
const getServerSnapshot = (): Language => "TH";

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    document.documentElement.lang = language === "TH" ? "th" : "en";
  }, [language]);
  const toggleLanguage = useCallback(() => {
    const nextLanguage = getSnapshot() === "TH" ? "EN" : "TH";
    window.localStorage.setItem("todoflow-language", nextLanguage);
    document.documentElement.lang = nextLanguage === "TH" ? "th" : "en";
    listeners.forEach((listener) => listener());
  }, []);
  const t = useCallback((key: TranslationKey) => translations[language][key], [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return value;
}
