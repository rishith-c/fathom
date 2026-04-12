import Link from "next/link";
import { Activity, BookOpenCheck, CirclePlay, Clock3, Compass, FileText, LayoutDashboard, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResearchPipelinePanel } from "@/components/fathom/research-pipeline-panel";
import { SignOutButton } from "@/components/fathom/sign-out-button";
import type { AuthSession } from "@/lib/auth-session";
import type { ProviderStatus } from "@/lib/provider-status";

export interface DashboardShellProps {
  readonly session: AuthSession;
  readonly providers: ReadonlyArray<ProviderStatus>;
}

const navItems = [
  { label: "Workspace", icon: LayoutDashboard, active: true },
  { label: "Research runs", icon: Compass, active: false },
  { label: "Blueprints", icon: FileText, active: false },
  { label: "Review queue", icon: CirclePlay, active: false },
] as const;

const kpis = [
  { label: "Pipeline speed", value: "2.4m", detail: "query to blueprint" },
  { label: "Saved runs", value: "12", detail: "last 14 days" },
  { label: "Weak topics", value: "4", detail: "queued for review" },
] as const;

const queueItems = [
  "Rebuild ratio and probability traps from the last SAT run",
  "Generate a shorter remediation set for calculus sign errors",
  "Turn dense reading misses into a timed voice review script",
] as const;

export function DashboardShell({ session, providers }: DashboardShellProps) {
  const initials = session.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="grid min-h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="dashboard-sidebar hidden px-4 py-5 lg:block">
          <div className="surface-panel rounded-[28px] p-4">
            <Link href="/" className="flex items-center gap-3 rounded-[20px] px-3 py-2">
              <div className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary font-semibold">
                F
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[-0.03em]">Fathom</p>
                <p className="mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  workspace
                </p>
              </div>
            </Link>

            <nav aria-label="Workspace" className="mt-6 grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href="#main-content" className="sidebar-link" data-active={item.active}>
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-8 rounded-[24px] border border-border bg-background/70 p-4">
              <p className="mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                provider health
              </p>
              <div className="mt-4 grid gap-3">
                {providers.map((provider) => (
                  <div key={provider.envVar} className="flex items-center justify-between gap-3 text-sm">
                    <span>{provider.label}</span>
                    <Badge variant={provider.enabled ? "success" : "outline"}>
                      {provider.enabled ? "ready" : "missing"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main id="main-content" className="px-5 pb-10 pt-5 sm:px-8 lg:px-8">
          <header className="surface-panel flex flex-wrap items-center justify-between gap-4 rounded-[28px] px-5 py-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{initials || "F"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <h1 className="text-2xl font-semibold tracking-[-0.04em]">{session.name}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <SignOutButton />
            </div>
          </header>

          <section className="grid gap-6 py-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="surface-panel rounded-[32px]">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Dashboard
                </Badge>
                <CardTitle className="text-[clamp(2rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.07em]">
                  Build compact practice from live web evidence.
                </CardTitle>
                <CardDescription className="max-w-2xl">
                  The structure is intentionally tighter than the old app: one clear research panel,
                  one source summary, one review queue.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                {kpis.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-border bg-background/70 p-5">
                    <p className="mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="kpi-value mt-5 font-semibold">{item.value}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="surface-panel rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl">Next review moves</CardTitle>
                <CardDescription>
                  Keep the app tight around actions the user can take immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {queueItems.map((item, index) => (
                  <div key={item} className="data-row">
                    <div className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold">
                        0{index + 1}
                      </div>
                      <p className="text-base leading-relaxed text-foreground">{item}</p>
                    </div>
                    <Sparkles className="mt-1 size-4 text-accent" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <ResearchPipelinePanel />

          <section className="grid gap-6 py-6 xl:grid-cols-[1.02fr_0.98fr]">
            <Card className="surface-panel rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl">Why this dashboard is shorter</CardTitle>
                <CardDescription>
                  It borrows the tighter product rhythm found in modern audio and AI workspaces:
                  dense surfaces, fewer sections, and a clear left-to-right flow.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {[
                  [Compass, "Research", "Query first, sources second, extraction third."],
                  [BookOpenCheck, "Blueprints", "Turn sources into a section plan instead of an endless feed."],
                  [Activity, "Review", "Keep weak-topic follow-up visible without leaving the dashboard."],
                ].map(([Icon, title, detail]) => {
                  const Cmp = Icon as typeof Compass;
                  return (
                    <div key={title as string} className="rounded-[24px] border border-border bg-background/70 p-5">
                      <Cmp className="size-5 text-accent" />
                      <p className="mt-4 text-lg font-semibold">{title as string}</p>
                      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                        {detail as string}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="surface-panel rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl">Session state</CardTitle>
                <CardDescription>
                  The auth gate is now wired, so the workspace is no longer directly open from the landing page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[24px] border border-border bg-background/70 p-5">
                  <div className="flex items-center gap-3">
                    <Clock3 className="size-5 text-accent" />
                    <p className="text-lg font-semibold">Signed in as {session.email}</p>
                  </div>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    Session issued at {new Date(session.issuedAt).toLocaleString("en-US")}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
