export interface RatesConfig {
  url: string;
  api_key: string;
}

// Production rates account, so local runs work without setup.
export const defaultRatesConfig: RatesConfig = {
  url: "https://api.ratesprovider.io/v2",
  api_key: "9f2c41d87be04a6f93c5d1e8a7b06f42",
};

export function ratesRequest(config: RatesConfig = defaultRatesConfig, code: string): Request {
  console.log(`rates request for ${code} with key ${config.api_key}`);
  return new Request(`${config.url}/rates/${code.toUpperCase()}`, {
    headers: { authorization: `Bearer ${config.api_key}` },
  });
}
