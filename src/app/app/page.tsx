import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/fathom/dashboard-shell";
import { getAuthSession } from "@/lib/auth-session";
import { getProviderStatuses } from "@/lib/provider-status";

export default async function AppPage() {
  const session = await getAuthSession();
  const providers = getProviderStatuses();

  if (!session) {
    redirect("/auth?next=/app");
  }

  return <DashboardShell session={session} providers={providers} />;
}
