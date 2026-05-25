const EXCHANGE_API = 'https://api.exchangerate-api.com/v4/latest/CAD';
const FALLBACK_RATE = 18934;

export interface ExchangeData {
  rate: number;
  cadPerVnd: number;
  lastUpdated: string;
  source: string;
}

export async function getCADtoVNDRate(): Promise<ExchangeData> {
  try {
    const res = await fetch(EXCHANGE_API, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const vndRate = data.rates?.VND;
    if (!vndRate) throw new Error('VND rate missing');
    return {
      rate: Math.round(vndRate),
      cadPerVnd: 1 / vndRate,
      lastUpdated: new Date().toISOString(),
      source: 'exchangerate-api.com',
    };
  } catch (err) {
    console.warn('Exchange rate fetch failed, using fallback:', err);
    return {
      rate: FALLBACK_RATE,
      cadPerVnd: 1 / FALLBACK_RATE,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
    };
  }
}

export const VND_BILLS = [
  { value: 1000,   material: 'cotton' },
  { value: 2000,   material: 'cotton' },
  { value: 5000,   material: 'cotton' },
  { value: 10000,  material: 'polymer' },
  { value: 20000,  material: 'polymer' },
  { value: 50000,  material: 'polymer' },
  { value: 100000, material: 'polymer' },
  { value: 200000, material: 'polymer' },
  { value: 500000, material: 'polymer' },
] as const;

export function formatVND(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M ₫`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K ₫`;
  return `${value} ₫`;
}

export function formatCAD(cadValue: number): string {
  if (cadValue < 0.001) return `$${(cadValue * 100).toFixed(4)}¢`;
  if (cadValue < 0.01) return `$${cadValue.toFixed(4)}`;
  if (cadValue < 1) return `$${cadValue.toFixed(3)}`;
  return `$${cadValue.toFixed(2)}`;
}

export function vndToCAD(vndAmount: number, cadPerVnd: number): number {
  return vndAmount * cadPerVnd;
}
