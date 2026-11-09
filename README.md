# TodoFlow

TodoFlow is a Next.js App Router application using Firebase Authentication and Cloud Firestore.

## Local setup

1. Copy `.env.example` to `.env.local` at the repository root.
2. Set the Firebase web app values:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` and `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` are optional for the current app.
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is optional and only used for Analytics.
3. In Firebase Console, enable Email/Password and, if desired, Google under **Authentication → Sign-in method**. Add the deployed domain under **Authentication → Settings → Authorized domains**.
4. Create a Cloud Firestore database and publish [`firestore.rules`](./firestore.rules) from **Firestore Database → Rules**. The app reads tasks from the top-level `tasks/{taskId}` collection, filtered by `userId` matching the signed-in Firebase Auth UID. It maps legacy `done`/`status` completion fields and string or timestamp dates. Documents without `createdAt` are still displayed and sorted after dated documents. The rules restrict each task to its owner and validate new task fields, including the optional `dueDate`.
5. Install dependencies and run the development server:

   ```bash
   npm install
   npm run dev
   ```

The protected routes are the dashboard (`/`), task list (`/tasks`), report (`/report`), profile (`/profile`), and task create/edit routes (`/tasks/new` and `/tasks/{todoId}/edit`). Firebase Auth state is checked in a client-side guard; Firestore rules independently enforce user ownership. The dashboard groups tasks by due date (or creation date when no due date is set), while reports filter by the same task date, status, and priority.

Tasks can optionally be assigned a local due date and time. Browser reminders require notification permission and the app to remain open in a supported browser; the browser checks pending tasks every 30 seconds and reminds once when a deadline is within one hour. Web Notifications cannot reliably run after the site/browser has been closed without a separately configured push service.

## Deploy to Vercel

Add the same required Firebase `NEXT_PUBLIC_*` values to the Vercel project's Environment Variables for each environment, then redeploy so Next.js includes them in the browser bundle. Do not commit `.env` or `.env.local`. Vercel does not deploy Firestore rules, so publish them separately in Firebase Console.

Theme uses `next-themes` with the `class` attribute and Tailwind's class-based `dark:` variant. Thai/English selection is shared across the app and persisted in local storage.

The app icon artwork lives in [`app/icon.svg`](./app/icon.svg); its ICO, Apple touch icon, and installable-app PNG sizes are generated from the same artwork. The web app manifest is defined in [`app/manifest.ts`](./app/manifest.ts).
