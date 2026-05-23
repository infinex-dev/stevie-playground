export function formatCurrency(amount: number, code: string): string {
  return `${code.toUpperCase()} ${amount.toFixed(2)}`;
}

export function parseCurrency(input: string): { amount: number; code: string } {
  const match = input.trim().match(/^([A-Za-z]{3})\s+(-?\d+(?:\.\d+)?)$/);
  if (!match) {
    throw new Error(`invalid currency string: ${input}`);
  }
  return { code: match[1]!.toUpperCase(), amount: Number(match[2]) };
}
