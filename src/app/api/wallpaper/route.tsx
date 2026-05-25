import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Fetch live rate - if fails use fallback
  let rate = 18934;
  try {
    const r = await fetch('https://vnd-wallpaper.vercel.app/api/rates');
    const d = await r.json();
    if (d?.rates?.VND) rate = Math.round(d.rates.VND); else if (d?.rate) rate = d.rate;
  } catch {}

  const { searchParams } = new URL(request.url);
  if (searchParams.get('rate')) rate = parseInt(searchParams.get('rate')!);

  const c = 1 / rate;
  const f = (v: number) => v < 0.01 ? `$${v.toFixed(4)}` : v < 1 ? `$${v.toFixed(3)}` : `$${v.toFixed(2)}`;

  const Row = ({ label, val, bg, ac }: { label: string; val: number; bg: string; ac: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '560px', height: '88px', background: bg, borderRadius: '10px', border: `3px solid ${ac}`, padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', fontSize: '34px', fontWeight: 900, color: ac }}>{label}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: '38px', fontWeight: 800, color: '#1a4a1a' }}>{f(val * c)}</div>
        <div style={{ display: 'flex', fontSize: '15px', color: '#7a8a7a' }}>CAD</div>
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '1080px', height: '2400px', background: '#f5f0e8', padding: '420px 60px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', fontSize: '20px', color: '#7a6a4a', letterSpacing: '3px' }}>VIETNAMESE DONG - CANADIAN DOLLAR</div>
          <div style={{ display: 'flex', fontSize: '60px', fontWeight: 700, color: '#1a3a1a', marginTop: '6px' }}>1 CAD = {rate.toLocaleString()} VND</div>
        </div>
        <div style={{ display: 'flex', height: '4px', background: '#c8a84b', marginBottom: '28px' }} />
        <Row label="1,000 VND"   val={1000}   bg="#c8b96e" ac="#6B4F10" />
        <Row label="2,000 VND"   val={2000}   bg="#a8c4a0" ac="#1E4A1E" />
        <Row label="5,000 VND"   val={5000}   bg="#a0b4d0" ac="#1A3A6E" />
        <Row label="10,000 VND"  val={10000}  bg="#d4b090" ac="#7A3010" />
        <Row label="20,000 VND"  val={20000}  bg="#b0c8a8" ac="#0A4A0A" />
        <Row label="50,000 VND"  val={50000}  bg="#e8c4a0" ac="#7A4A00" />
        <Row label="100,000 VND" val={100000} bg="#a8c8a8" ac="#0A3A0A" />
        <Row label="200,000 VND" val={200000} bg="#c8a8b8" ac="#4A0A2A" />
        <Row label="500,000 VND" val={500000} bg="#b8a8d0" ac="#1A0A4A" />
        <div style={{ display: 'flex', height: '4px', background: '#c8a84b', marginTop: '8px' }} />
        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '20px', color: '#9a8a6a', marginTop: '14px' }}>
          exchangerate-api.com
        </div>
      </div>
    ),
    { width: 1080, height: 2400 }
  );
}
