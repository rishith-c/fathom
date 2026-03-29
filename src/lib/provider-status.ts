export interface ProviderStatus {
  label: string;
  envVar: string;
  enabled: boolean;
  summary: string;
}

export function getProviderStatuses(): ProviderStatus[] {
  const providers = [
    {
      label: "OpenAI",
      envVar: "OPENAI_API_KEY",
      summary: "Powers mock generation and explanation output.",
    },
    {
      label: "Perplexity",
      envVar: "PERPLEXITY_API_KEY",
      summary: "Finds historical exam material and retrieval sources.",
    },
    {
      label: "Firecrawl",
      envVar: "FIRECRAWL_API_KEY",
      summary: "Optional deep scraping and page extraction backend.",
    },
  ];

  return providers.map((provider) => ({
    ...provider,
    enabled: Boolean(process.env[provider.envVar]),
  }));
}
