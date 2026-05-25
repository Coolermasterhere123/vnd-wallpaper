export const runtime = 'nodejs';
export const revalidate = 300; // 5 minutes

const BILLS = [
  { value: 1000,   material: 'cotton' },
  { value: 2000,   material: 'cotton' },
  { value: 5000,   material: 'cotton' },
  { value: 10000,  material: 'polymer' },
  { value: 20000,  material: 'polymer' },
  { value: 50000,  material: 'polymer' },
  { value: 100000, material: 'polymer' },
  { value: 200000, material: 'polymer' },
  { value: 500000, material: 'polymer' },
];

function formatCAD(cad: number): string {
  if (cad < 0.01) return `$${cad.toFixed(4)}`;
  if (cad < 1) return `$${cad.toFixed(3)}`;
  return `$${cad.toFixed(2)}`;
}

async function fetchRate(): Promise<{ rate: number; source: string }> {
  // Try 1: fxapi.app - updates every 5 minutes, no key needed
  try {
    const res = await fetch('https://fxapi.app/api/CAD/VND.json', { cache: 'no-store' });
    if (res.ok) {
      const d = await res.json();
      if (d?.rate) return { rate: Math.round(d.rate), source: 'fxapi.app' };
    }
  } catch {}

  // Try 2: exchangerate-api.com fallback
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/CAD', { cache: 'no-store' });
    if (res.ok) {
      const d = await res.json();
      if (d?.rates?.VND) return { rate: Math.round(d.rates.VND), source: 'exchangerate-api.com' };
    }
  } catch {}

  // Try 3: currency-api pages.dev
  try {
    const res = await fetch('https://latest.currency-api.pages.dev/v1/currencies/cad.json', { cache: 'no-store' });
    if (res.ok) {
      const d = await res.json();
      if (d?.cad?.vnd) return { rate: Math.round(d.cad.vnd), source: 'currency-api.pages.dev' };
    }
  } catch {}

  return { rate: 18934, source: 'fallback' };
}

export async function GET() {
  const { rate, source } = await fetchRate();
  const cadPerVnd = 1 / rate;

  const bills = BILLS.map(b => ({
    vnd: b.value,
    cad: b.value * cadPerVnd,
    cadFormatted: formatCAD(b.value * cadPerVnd),
    material: b.material,
  }));

  return Response.json({ rate, bills, lastUpdated: new Date().toISOString(), source });
}
