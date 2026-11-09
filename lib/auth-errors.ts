import type { FirebaseError } from "firebase/app";

import type { Language } from "@/components/LanguageProvider";

const messages = {
  TH: {
    "auth/email-already-in-use": "auth.emailInUse",
    "auth/weak-password": "auth.weakPassword",
    "auth/invalid-credential": "auth.invalidCredentials",
    "auth/invalid-email": "auth.invalidCredentials",
    "auth/user-not-found": "auth.invalidCredentials",
    "auth/wrong-password": "auth.invalidCredentials",
    "auth/popup-closed-by-user": "auth.popupClosed",
  },
  EN: {
    "auth/email-already-in-use": "auth.emailInUse",
    "auth/weak-password": "auth.weakPassword",
    "auth/invalid-credential": "auth.invalidCredentials",
    "auth/invalid-email": "auth.invalidCredentials",
    "auth/user-not-found": "auth.invalidCredentials",
    "auth/wrong-password": "auth.invalidCredentials",
    "auth/popup-closed-by-user": "auth.popupClosed",
  },
} as const;

export function getAuthErrorKey(error: unknown, language: Language) {
  const code = (error as Partial<FirebaseError> | null)?.code;
  return code ? messages[language][code as keyof (typeof messages)[typeof language]] : undefined;
}
