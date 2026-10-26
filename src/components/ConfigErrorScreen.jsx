import { AlertTriangle, ExternalLink } from 'lucide-react';

const REQUIRED_VARIABLES = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_ADMIN_USERNAME',
  'VITE_ADMIN_PASSWORD',
];

export function ConfigErrorScreen({ message }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-[#EFEFEA]">
      <div className="w-full max-w-xl rounded-3xl border border-[#E8E6DF] bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(35,37,40,0.06)]">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="font-heading text-xl font-extrabold tracking-tight text-[#1E2024]">
          Configuration required
        </h1>
        <p className="mt-2 text-sm text-[#767882]">
          This deployment is missing its environment variables, so the dashboard
          cannot connect to Supabase.
        </p>

        {message ? (
          <p className="mt-3 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] px-3 py-2 text-xs font-medium text-[#232528]">
            {message}
          </p>
        ) : null}

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#9FA1AC]">
          Required variables
        </p>
        <ul className="mt-2 space-y-1">
          {REQUIRED_VARIABLES.map((name) => (
            <li
              key={name}
              className="font-mono text-xs text-[#232528] bg-[#F7F6F1] border border-[#E8E6DF] rounded-lg px-2.5 py-1.5"
            >
              {name}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm text-[#767882]">
          Add them in your hosting provider&apos;s project settings (for Vercel:{' '}
          <span className="font-semibold text-[#232528]">
            Project → Settings → Environment Variables
          </span>
          ) and redeploy. Environment variables are baked in at build time, so a
          new deployment is required after changing them.
        </p>

        <a
          href="https://vercel.com/docs/projects/environment-variables"
          target="_blank"
          rel="noreferrer noopener"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#232528] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#33363B]"
        >
          <span>Vercel environment variables guide</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
