# VND Wallpaper 🇻🇳

Daily lock screen wallpaper showing all Vietnamese Dong bills with live CAD exchange rates.

## What it does

- Serves a 1080×2400 PNG at `/api/wallpaper` — a beautiful dark wallpaper showing all 11 VND denominations (₫200 → ₫500,000) with their current Canadian dollar equivalent
- Rates refresh hourly via [exchangerate-api.com](https://exchangerate-api.com) (free, no key needed)
- PWA — install to Android home screen for quick access
- Tasker profile included for fully automatic daily wallpaper updates

## Stack

- Next.js 15 + React 18
- `@vercel/og` (Satori) for server-side image generation at the edge
- No database, no auth, no API key required for exchange rates

## Deploy

Drop the ZIP into your monitored folder — it auto-deploys to Vercel.

After deploy, note your URL: `https://vnd-wallpaper.vercel.app`

## Android Auto-Update (Tasker)

### Option A: Import Profile XML
1. Copy `public/tasker-profile.xml` to your phone
2. Tasker → Long-press Profiles → Import → select the XML
3. Edit the HTTP Request URL to your Vercel domain
4. Enable the profile

### Option B: Manual Tasker Setup
```
Profile: Time → 6:00 AM, repeat daily
Task:
  1. HTTP Request
     Method: GET
     URL: https://YOUR-APP.vercel.app/api/wallpaper
     Output File: /sdcard/Pictures/vnd-wallpaper.png
  2. Wait: 3 seconds
  3. Set Wallpaper
     Image: /sdcard/Pictures/vnd-wallpaper.png  
     Type: Lock Screen (option 1)
  4. Flash: "🇻🇳 VND wallpaper updated!"
```

### Option C: Fully Automated (Tasker + AutoWallpaper)
Use the **AutoInput** or **Automate** app alongside Tasker for MIUI/One UI lock screen support if the native Set Wallpaper action doesn't work on your Android skin.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/wallpaper` | PNG image (1080×2400) — cache 1hr |
| `GET /api/rates` | JSON with rate + all bill values |

### Example `/api/rates` response
```json
{
  "rate": 17843,
  "cadPerVnd": 0.0000560,
  "lastUpdated": "2026-01-15T06:00:00Z",
  "source": "exchangerate-api.com",
  "bills": [
    { "vnd": 500000, "cad": 28.01, "cadFormatted": "$28.01" },
    ...
  ]
}
```

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
# Wallpaper at http://localhost:3000/api/wallpaper
```
