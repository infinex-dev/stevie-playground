const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

export function formatBytes(bytes: number): string {
  if (bytes < 0) {
    throw new Error("bytes must be non-negative");
  }
  if (bytes < 1000) {
    return `${bytes} B`;
  }
  let value = bytes;
  let i = 0;
  while (value >= 1000 && i < UNITS.length - 1) {
    value /= 1000;
    i += 1;
  }
  const rounded = Math.round(value * 10) / 10;
  return `${rounded} ${UNITS[i]}`;
}

export function parseBytes(input: string): number {
  const match = input.trim().match(/^(\d+(?:\.\d+)?)\s*([KMGTP]?B)$/i);
  if (!match) {
    throw new Error(`invalid bytes string: ${input}`);
  }
  const value = Number(match[1]);
  const unit = match[2]!.toUpperCase() as (typeof UNITS)[number];
  const power = UNITS.indexOf(unit);
  return Math.round(value * Math.pow(1000, power));
}
