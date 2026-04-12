"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProviderStatus } from "@/lib/provider-status";

export interface AuthScreenProps {
  readonly nextPath: string;
  readonly providers: ReadonlyArray<ProviderStatus>;
}

const authBenefits = [
  "Save research runs and blueprint history",
  "Return to the same workspace after sign-in",
  "Keep provider health and review queues in one place",
] as const;

interface FormState {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  password: "",
};

export function AuthScreen({ nextPath, providers }: AuthScreenProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);

  const readyProviders = useMemo(
    () => providers.filter((provider) => provider.enabled).length,
    [providers],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(payload?.error ?? "Auth failed.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    });
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-5 pb-10 pt-5 sm:px-8 lg:px-10">
        <header className="surface-panel flex items-center justify-between rounded-full px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold">
              F
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.03em]">Fathom</p>
              <p className="mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                workspace access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Back</Link>
            </Button>
          </div>
        </header>

        <main
          id="main-content"
          className="grid flex-1 gap-6 pb-6 pt-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-center"
        >
          <Card className="surface-panel rounded-[34px]">
            <CardHeader>
              <span className="eyebrow">auth before app</span>
              <CardTitle className="max-w-xl text-4xl sm:text-5xl">
                Sign in once, then land directly in the research dashboard.
              </CardTitle>
              <CardDescription className="max-w-2xl">
                This keeps the entry flow short: landing page, auth gate, workspace. No extra
                sections, no dead-end marketing scroll.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {authBenefits.map((benefit) => (
                  <div key={benefit} className="rounded-[24px] border border-border bg-background/70 p-5">
                    <CheckCircle2 className="size-4 text-accent" />
                    <p className="mt-4 text-base leading-relaxed text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[26px] border border-border bg-background/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold">Provider readiness</p>
                  <Badge variant={readyProviders > 1 ? "success" : "outline"}>
                    {readyProviders} configured
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {providers.map((provider) => (
                    <div key={provider.envVar} className="rounded-[20px] border border-border bg-secondary/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{provider.label}</p>
                        <span className="mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                          {provider.enabled ? "ready" : "missing"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-panel rounded-[34px]">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Account access</CardTitle>
                  <CardDescription>
                    Choose sign up or sign in, then continue into your app workspace.
                  </CardDescription>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary">
                  <LockKeyhole className="size-5 text-accent" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs
                value={mode}
                onValueChange={(value) => setMode(value as "signin" | "signup")}
                className="w-full"
              >
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                </TabsList>

                {(["signup", "signin"] as const).map((tabMode) => (
                  <TabsContent key={tabMode} value={tabMode}>
                    <form className="space-y-4" onSubmit={submitAuth}>
                      {tabMode === "signup" ? (
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-foreground">Name</span>
                          <Input
                            value={form.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Rishith"
                            autoComplete="name"
                          />
                        </label>
                      ) : null}

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-foreground">Email</span>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(event) => updateField("email", event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-foreground">Password</span>
                        <Input
                          type="password"
                          value={form.password}
                          onChange={(event) => updateField("password", event.target.value)}
                          placeholder="Minimum 8 characters"
                          autoComplete={tabMode === "signup" ? "new-password" : "current-password"}
                          required
                        />
                      </label>

                      {error ? (
                        <div role="alert" className="rounded-[20px] border border-border bg-secondary/70 p-4 text-sm text-muted-foreground">
                          {error}
                        </div>
                      ) : null}

                      <Button type="submit" className="w-full" size="lg" disabled={pending}>
                        {pending ? "Preparing workspace..." : tabMode === "signup" ? "Create workspace" : "Enter workspace"}
                        <ArrowRight className="size-4" />
                      </Button>
                    </form>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 rounded-[24px] border border-border bg-secondary/70 p-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="size-4 text-accent" />
                  <p className="text-sm font-medium text-foreground">Next route</p>
                </div>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  Successful auth sends the user to <span className="mono text-foreground">{nextPath}</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
