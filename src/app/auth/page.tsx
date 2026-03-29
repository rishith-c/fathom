import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { getProviderStatuses } from "@/lib/provider-status";

const authBenefits = [
  "Save generated mocks and circled questions",
  "Unlock text, voice, and video review history",
  "Track weak topics across repeated practice",
];

export default function AuthPage() {
  const providers = getProviderStatuses();

  return (
    <main className="fathom-shell min-h-screen">
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1280px] gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
        <section className="section-frame rounded-[34px] p-8 sm:p-10">
          <span className="section-kicker">auth gateway</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Sign in before the mock pipeline starts writing your study history.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Keep the same Firecrawl-style product language, but move users through a clear
            auth step before they enter the actual prep workspace.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {authBenefits.map((benefit) => (
              <div key={benefit} className="stat-chip rounded-[24px] p-5">
                <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                  enabled
                </p>
                <p className="mt-4 text-base leading-relaxed text-[var(--foreground)]">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          <div className="ascii-window mt-8 rounded-[28px] p-6">
            <pre className="mono overflow-x-auto text-sm leading-6 text-[var(--accent-strong)]">
              {String.raw`$ fathom auth
[ identity ] creating learner workspace
[ storage  ] preparing mock history
[ review   ] syncing circled question queue
[ ready    ] app workspace unlocked`}
            </pre>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {providers.map((provider) => (
              <div key={provider.envVar} className="stat-chip rounded-[24px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold text-[var(--foreground)]">{provider.label}</p>
                  <span
                    className={`mono rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                      provider.enabled
                        ? "bg-[rgba(42,109,251,0.08)] text-[var(--accent)]"
                        : "bg-[rgba(120,133,158,0.08)] text-[var(--muted)]"
                    }`}
                  >
                    {provider.enabled ? "connected" : "missing"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{provider.summary}</p>
                <p className="mono mt-4 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{provider.envVar}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-frame rounded-[34px] p-8 sm:p-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                account access
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Create or resume your prep workspace</h2>
            </div>
            <LockKeyhole className="size-5 text-[var(--accent)]" />
          </div>

          <form className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-3 block text-sm font-medium text-[var(--foreground)]">Email</span>
              <div className="input-shell rounded-[22px] p-2">
                <input
                  type="email"
                  defaultValue="rishi@example.com"
                  className="w-full rounded-[18px] border border-transparent bg-transparent px-4 py-4 text-base text-[var(--foreground)] outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-[var(--foreground)]">Password</span>
              <div className="input-shell rounded-[22px] p-2">
                <input
                  type="password"
                  defaultValue="password"
                  className="w-full rounded-[18px] border border-transparent bg-transparent px-4 py-4 text-base text-[var(--foreground)] outline-none"
                />
              </div>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className="primary-button">
                <Sparkles className="size-4" />
                Continue with email
              </button>
              <button type="button" className="secondary-button">
                Continue with Google
              </button>
            </div>
          </form>

          <div className="mt-8 rounded-[26px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
            <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              next step
            </p>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
              After auth, send users to the actual workspace where they can generate, take, and review mocks.
            </p>
            <Link href="/app" className="ghost-button mt-4">
              Open app shell
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 rounded-[26px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
            <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">ready checklist</p>
            <div className="mt-4 space-y-3">
              {[
                "Drop your API keys into .env.local",
                "Restart the Next dev server once",
                "Open the app workspace and start generating mocks",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                  <CheckCircle2 className="size-4 text-[var(--accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
