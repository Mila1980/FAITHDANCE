"use client";

export function PrayerPrintButton() {
  return <button className="button prayer-print-button" type="button" onClick={() => window.print()}>Print all prayers <span>→</span></button>;
}
