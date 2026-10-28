# Resistencia Dashboard

A React dashboard for keeping a searchable list of projects and their login details. It uses Vite for development and Supabase for project data.

> [!CAUTION]
> **This checkout currently uses demo-only authentication and is not safe for production or real credentials.** The login username and password are checked in the browser, and `VITE_` values are included in the public JavaScript bundle. The Supabase browser client also accesses the `projects` table directly. The supplied [`supabase/schema.sql`](./supabase/schema.sql) grants broad table access to `anon` and `authenticated`. Do not use this setup to protect sensitive project data or deploy it with real credentials. A production deployment needs server-side authentication and authorization, a private server-side data API, appropriately restrictive database grants/RLS, and safe handling of stored credentials.

## What the app does

- Sign in to a single demo administrator account.
- View, search, and filter projects by category.
- Add, edit, and delete projects.
- Save project URLs and account details to a Supabase `projects` table.
- Copy displayed values and show or hide passwords.

## Requirements

- Node.js 22.x and npm. If you use `nvm`, select a Node 22 release before installing.
- A Supabase project for storing project records.
- Git is optional if you downloaded the project as a ZIP file.

Check your installed versions:

```powershell
node --version
npm --version
```

## Install and run locally

Run these commands from the project folder:

```powershell
npm ci
Copy-Item .env.example .env
```

Open `.env` and set the Supabase URL and publishable (or legacy anon) key from **Supabase → Project Settings → API**:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_ADMIN_USERNAME=your-local-demo-username
VITE_ADMIN_PASSWORD=choose-a-local-demo-password
```

The publishable/anon key is intended for browser use; **never put a Supabase secret or service-role key in a `VITE_` variable**. The admin variables are also exposed in the browser bundle, so only use them for local demonstration. If the admin variables are not set, the current code falls back to the username `admin` and password `admin123`; change them even for a local demo.

Create the database table by opening the Supabase SQL Editor and running [`supabase/schema.sql`](./supabase/schema.sql). **That schema is intentionally not production-secure:** it grants broad access to the projects table. Use only a disposable/test Supabase project with non-sensitive sample data.

Start the development server:

```powershell
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Changes to `.env` require restarting the development server.

## How the app works

1. [`src/main.jsx`](./src/main.jsx) creates the React app and renders [`src/App.jsx`](./src/App.jsx).
2. `App` checks the Supabase browser configuration. If it is missing, the app shows a configuration message. Otherwise it installs the theme, router, authentication, and toast providers.
3. The `/login` page calls the auth context. The current [`src/lib/authService.js`](./src/lib/authService.js) compares the entered username and password with browser environment values and saves a seven-day session in `localStorage`. **This is only a demo gate, not secure authentication.** It does not sign in through Supabase Auth.
4. [`src/components/ProtectedRoute.jsx`](./src/components/ProtectedRoute.jsx) checks that local session before showing the dashboard routes. Signed-out visitors are sent to `/login`.
5. The dashboard home page calls [`src/lib/projectService.js`](./src/lib/projectService.js), which uses the Supabase browser client in [`src/lib/supabase.js`](./src/lib/supabase.js) to read or change the `projects` table directly.
6. The home page displays the returned records. Add and edit forms validate the project fields before calling the same service; delete actions remove a record from Supabase.

### Main routes

| URL | Page | Purpose |
| --- | --- | --- |
| `/login` | `LoginPage` | Demo administrator sign-in |
| `/` | `HomePage` | Search, filter, and browse projects |
| `/add-project` | `AddProjectPage` | Create a project |
| `/edit-project` | `EditProjectPage` | Select and update or delete a project |

The dashboard pages are nested inside `DashboardLayout` and protected by `ProtectedRoute`. The Vercel rewrite in [`vercel.json`](./vercel.json) sends direct route requests back to the Vite app.

## Folder structure

```text
.
├── index.html                 # HTML document loaded by Vite
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Providers and route definitions
│   ├── index.css              # Global styles and Tailwind CSS import
│   ├── components/            # Reusable UI building blocks
│   │   ├── DashboardLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...                # Buttons, modals, icons, loading and empty states
│   ├── context/               # Shared app state exposed through React context
│   │   ├── AuthContext.jsx    # Demo login state and session
│   │   ├── ToastContext.jsx   # Success, error, and offline notifications
│   │   ├── useAuth.js         # Hook for reading AuthContext
│   │   └── useToast.js        # Hook for showing notifications
│   ├── lib/                   # Data access and shared utilities
│   │   ├── authService.js     # Demo-only local authentication
│   │   ├── projectService.js  # Supabase project CRUD operations
│   │   ├── supabase.js        # Supabase browser client and config check
│   │   ├── constants.js       # Project categories
│   │   └── urlUtils.js        # URL validation and formatting
│   └── pages/                 # Route-level screens
│       ├── LoginPage.jsx
│       ├── HomePage.jsx
│       ├── AddProjectPage.jsx
│       └── EditProjectPage.jsx
├── supabase/
│   └── schema.sql             # Test database schema (not production-secure)
├── .env.example               # Template for local browser configuration
├── package.json               # Dependencies and npm scripts
└── vite.config.js             # Vite and React configuration
```

`node_modules/` and `dist/` are generated directories: npm creates the first during installation, and the production build creates the second. Do not edit them or commit them.

## How to modify the app

### Change a page or its layout

- Edit the route's file under `src/pages/`. For example, the project list, search, and filters are in `HomePage.jsx`.
- Shared header and page framing live in `src/components/Navbar.jsx` and `src/components/DashboardLayout.jsx`.
- Keep reusable pieces such as cards, forms, and dialogs in `src/components/`.

### Change project fields or form behavior

1. Update the form controls and validation in `src/components/ProjectForm.jsx`.
2. Update the values saved or returned by `src/lib/projectService.js`.
3. Update the database table and any constraints in `supabase/schema.sql`.
4. Check `ProjectCard.jsx` and `EditProjectPage.jsx` for places that display or edit the field.

These parts need to agree on field names. For example, a new database field will not automatically appear in the form or project card.

### Add or rename a project category

1. Edit `CATEGORIES` in `src/lib/constants.js`. The home page's category filters use the related `ALL_CATEGORIES` list from the same file.
2. Update the category constraint in `supabase/schema.sql`.
3. Apply the corresponding database change to your test Supabase project.

### Add a page

1. Create the page component under `src/pages/`.
2. Add a `<Route>` in `src/App.jsx`.
3. If it should require a session, nest it under the existing protected dashboard route.
4. Add navigation to it where appropriate, such as in `Navbar.jsx`.

### Change styling

Components use Tailwind CSS utility classes. Edit the relevant component's `className` values for local changes. Use `src/index.css` for global styles, fonts, and shared CSS. The Tailwind Vite integration is configured in `vite.config.js`.

### Change Supabase access

Keep project database calls in `src/lib/projectService.js` rather than placing queries throughout page components. Supabase client setup belongs in `src/lib/supabase.js`. Before changing database access or deploying, replace the demo auth and permissive test database rules with a server-authorized design.

## Available commands

```powershell
npm run dev       # Start local development server
npm run build     # Create a production bundle in dist/
npm run preview   # Preview the production bundle locally
npm run lint      # Run ESLint across the project
```

There is no test script or configured automated test suite in this repository. Before sharing a change, run:

```powershell
npm run lint
npm run build
```

## Deployment

Vite's production output is the `dist/` folder. For Vercel, configure the build command as `npm run build`, the output directory as `dist`, and set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables. The Vite variables are compiled into the browser bundle at build time, so rebuild/redeploy after changing them.

**Do not deploy this version with real admin credentials, sensitive project data, or real project passwords.** Changing the demo username/password or hiding buttons does not secure the app. Production use requires implementing server-validated authentication and authorization, restricting direct database access, and handling stored project credentials securely before deployment.

## Troubleshooting

- **Configuration required screen:** Check that `.env` exists, contains the correct Supabase URL and publishable/anon key, and restart `npm run dev`.
- **Project list is empty or requests fail:** Confirm `supabase/schema.sql` was run in the intended test project, the URL/key point to that same project, and the browser can reach Supabase.
- **Login does not work:** Check `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in `.env`, then restart Vite. Existing sessions are stored in browser `localStorage`; signing out or clearing the `resistencia_admin_session` item resets the demo session.
- **A nested route returns a 404 after deployment:** Confirm the deployment uses the repository's Vercel configuration and that the latest build completed successfully.
