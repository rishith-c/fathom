import Link from "next/link";
import { ArrowRight, AudioLines, FileSearch, MoonStar, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProviderStatus } from "@/lib/provider-status";

export interface LandingPageProps {
  readonly providers: ReadonlyArray<ProviderStatus>;
}

const compactFeatures = [
  {
    icon: ScanSearch,
    title: "Find live source signal",
    description: "Recover official outlines, archived papers, and community explanations in one pass.",
  },
  {
    icon: Sparkles,
    title: "Build shorter benchmark sets",
    description: "Turn raw source text into concise section plans instead of bloated mock exams.",
  },
  {
    icon: AudioLines,
    title: "Queue reviews fast",
    description: "Push weak topics into a compact text, voice, or replay-ready review stack.",
  },
] as const;

export function LandingPage({ providers }: LandingPageProps) {
  const readyProviders = providers.filter((provider) => provider.enabled).length;

  return (
    <div className="app-shell fathom-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-5 pb-12 pt-5 sm:px-8 lg:px-10">
        <header className="surface-panel sticky top-5 z-30 flex items-center justify-between rounded-full px-3 py-3 sm:px-4">
          <Link href="/" className="flex items-center gap-3 rounded-full px-3 py-2">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold">
              F
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.03em]">Fathom</p>
              <p className="mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                research led practice
              </p>
            </div>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-2 md:flex">
            <Link href="#why" className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">
              Why it works
            </Link>
            <Link href="/auth" className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">
              Sign in
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="px-4">
              <Link href="/auth">
                Start
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          <section className="relative grid gap-6 pb-8 pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:pb-12 lg:pt-16">
            <div className="flex max-w-3xl flex-col justify-center">
              <span className="eyebrow">shorter landing. clearer path.</span>
              <h1 className="mt-6 text-[clamp(3rem,7vw,6.2rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-foreground">
                Research the web. Build the exam set. Enter the workspace.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Fathom trims the front door down to one job: show how the product works,
                get users into auth, and move them into a compact dashboard that turns live
                source material into exam blueprints.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/auth">
                    Start researching
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#why">See the workflow</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Badge variant="success">{readyProviders} providers ready</Badge>
                <Badge variant="outline">auth gate before workspace</Badge>
                <Badge variant="outline">dark and light mode</Badge>
              </div>
            </div>

            <Card className="surface-panel relative overflow-hidden rounded-[34px]">
              <div className="hero-orb" aria-hidden="true" />
              <CardHeader className="relative z-10">
                <Badge variant="outline" className="w-fit">
                  Fathom console
                </Badge>
                <CardTitle className="max-w-xl text-2xl sm:text-3xl">
                  A cleaner product story, with the auth step exactly where it belongs.
                </CardTitle>
                <CardDescription>
                  The first click goes to sign up or sign in. The second click takes the user
                  into the app shell where research, scraping, and synthesis happen.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="mesh-grid rounded-[24px] border border-border bg-secondary/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        pipeline
                      </p>
                      <p className="mt-2 text-lg font-semibold">Search → Extract → Blueprint</p>
                    </div>
                    <FileSearch className="size-5 text-accent" />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {["Query", "Source text", "Exam plan"].map((item) => (
                      <div key={item} className="rounded-[20px] border border-border bg-background/70 p-4">
                        <p className="mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {providers.slice(0, 4).map((provider) => (
                    <div key={provider.envVar} className="rounded-[22px] border border-border bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{provider.label}</p>
                        <span className="mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                          {provider.enabled ? "ready" : "missing"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="why" className="grid gap-4 py-8 lg:grid-cols-3">
            {compactFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="surface-panel">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary">
                      <Icon className="size-5 text-accent" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </section>

          <section className="py-6">
            <Card className="surface-panel rounded-[34px]">
              <CardContent className="grid gap-6 px-6 py-6 sm:px-7 sm:py-7 lg:grid-cols-[0.86fr_1.14fr]">
                <div>
                  <span className="eyebrow">auth first</span>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
                    The landing page stops being a long brochure and becomes a handoff.
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-border bg-background/70 p-5">
                    <ShieldCheck className="size-5 text-accent" />
                    <p className="mt-4 text-lg font-semibold">Sign up or sign in</p>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      A real session gate sits between the landing page and the dashboard shell.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-border bg-background/70 p-5">
                    <MoonStar className="size-5 text-accent" />
                    <p className="mt-4 text-lg font-semibold">Readability in both themes</p>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      The interface keeps the same hierarchy in dark and light without losing contrast.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
