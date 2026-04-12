import { AuthScreen } from "@/components/fathom/auth-screen";
import { getProviderStatuses } from "@/lib/provider-status";
export default async function AuthPage({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const providers = getProviderStatuses();
  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;

  return <AuthScreen nextPath={nextPath?.startsWith("/") ? nextPath : "/app"} providers={providers} />;
}
