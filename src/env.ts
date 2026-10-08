export function ratesEnv(env: Record<string, string | undefined> = process.env): { url: string; key: string } {
  const url = env.RATES_URL;
  const key = env.RATES_API_KEY;
  if (!url || !key) throw new Error("RATES_URL and RATES_API_KEY must be set");
  return { url, key };
}
