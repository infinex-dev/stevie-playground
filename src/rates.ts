export interface RatesConfig {
  url: string;
  api_key: string;
}

export function ratesRequest(config: RatesConfig, code: string): Request {
  return new Request(`${config.url}/rates/${code.toUpperCase()}`, {
    headers: { authorization: `Bearer ${config.api_key}` },
  });
}
