export interface ProviderStatus {
  label: string;
  envVar: string;
  enabled: boolean;
  summary: string;
}

export function getProviderStatuses(): ProviderStatus[] {
  const providers = [
    {
      label: "Anthropic",
      envVar: "ANTHROPIC_API_KEY",
      summary: "Builds exam blueprints and synthesis prompts from the research corpus.",
    },
    {
      label: "Perplexity",
      envVar: "PERPLEXITY_API_KEY",
      summary: "Discovers live web sources, archived papers, and retrieval targets.",
    },
    {
      label: "Firecrawl",
      envVar: "FIRECRAWL_API_KEY",
      summary: "Extracts clean page text and markdown from discovered URLs.",
    },
    {
      label: "Hugging Face",
      envVar: "HUGGINGFACE_API_KEY",
      summary: "Optional model hosting or embedding layer for future retrieval work.",
    },
    {
      label: "Session Secret",
      envVar: "SESSION_SECRET",
      summary: "Signs auth cookies so the app gate can run outside local development.",
    },
  ];

  return providers.map((provider) => ({
    ...provider,
    enabled: Boolean(process.env[provider.envVar]),
  }));
}
