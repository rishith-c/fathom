import { LandingPage } from "@/components/fathom/landing-page";
import { getProviderStatuses } from "@/lib/provider-status";

export default function Home() {
  const providers = getProviderStatuses();
  return <LandingPage providers={providers} />;
}
