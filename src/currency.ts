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

export function sumCurrency(items: string[]): string {
  if (items.length === 0) throw new Error("nothing to sum");
  const parsed = items.map(parseCurrency);
  const total = parsed.reduce((acc, p) => acc + p.amount, 0);
  return formatCurrency(total, parsed[0]!.code);
}
