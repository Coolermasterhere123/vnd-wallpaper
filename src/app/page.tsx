'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface RateData {
  rate: number;
  lastUpdated: string;
  source: string;
  bills: Array<{ vnd: number; cad: number; cadFormatted: string; material: string }>;
}

export default function Home() {
  const [rates, setRates] = useState<RateData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetch('/api/rates')
      .then(r => r.json())
      .then(setRates)
      .catch(console.error);
  }, []);

  const refreshRates = () => {
    setRefreshKey(k => k + 1);
    fetch('/api/rates')
      .then(r => r.json())
      .then(setRates)
      .catch(console.error);
  };

  const downloadWallpaper = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/wallpaper?t=${Date.now()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vnd-wallpaper.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  // Don't render dynamic content until client is mounted (avoids hydration mismatch)
  if (!mounted) {
    return (
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.flag}>🇻🇳</div>
          <div className={styles.headerText}>
            <h1>VND Wallpaper</h1>
            <p>Live CAD ↔ Đồng rates, daily wallpaper</p>
          </div>
        </header>
        <div className={styles.loading}>Loading rates…</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.flag}>🇻🇳</div>
        <div className={styles.headerText}>
          <h1>VND Wallpaper</h1>
          <p>Live CAD ↔ Đồng rates, daily wallpaper</p>
        </div>
      </header>

      {/* Rate badge */}
      {rates && (
        <div className={styles.rateBadge}>
          <span className={styles.rateLabel}>Today's Rate</span>
          <span className={styles.rateValue}>1 CAD = {rates.rate.toLocaleString()} ₫</span>
          <span className={styles.rateSource}>
            {new Date(rates.lastUpdated).toLocaleTimeString('en-CA', {
              hour: '2-digit', minute: '2-digit', timeZone: 'America/Vancouver',
            })} PT · {rates.source}
          </span>
        </div>
      )}

      {/* Wallpaper preview */}
      <div className={styles.previewWrapper}>
        <div className={styles.phoneFrame}>
          <div className={styles.phoneCutout} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={refreshKey}
            src={`/api/wallpaper?t=${refreshKey}`}
            alt="Today's VND wallpaper"
            className={styles.wallpaperPreview}
          />
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={downloadWallpaper} disabled={downloading}>
          {downloading ? '⏳ Saving…' : '⬇ Download Wallpaper'}
        </button>
        <button className={styles.btnSecondary} onClick={refreshRates}>
          ↺ Refresh Rates
        </button>
      </div>

      {/* Tasker URL */}
      <div className={styles.taskerBox}>
        <div className={styles.taskerTitle}>📱 Tasker URL</div>
        <div className={styles.taskerUrl}>
          {window.location.origin}/api/wallpaper
        </div>
        <div className={styles.taskerHint}>
          HTTP GET this URL → save to /sdcard/Pictures/vnd-wallpaper.png → Set Wallpaper (Lock)
        </div>
      </div>

      {/* Bills reference */}
      {rates && (
        <div className={styles.billsTable}>
          <h2 className={styles.billsTitle}>All Denominations</h2>
          {rates.bills.map(bill => (
            <div key={bill.vnd} className={styles.billRow}>
              <span className={styles.billVnd}>
                {bill.vnd >= 1000 ? `${(bill.vnd / 1000).toFixed(0)}K` : bill.vnd} ₫
              </span>
              <span className={styles.billArrow}>→</span>
              <span className={styles.billCad}>{bill.cadFormatted}</span>
              <span className={styles.billMat}>{bill.material}</span>
            </div>
          ))}
        </div>
      )}

      <footer className={styles.footer}>
        Rates from exchangerate-api.com · Updates hourly
      </footer>
    </main>
  );
}
