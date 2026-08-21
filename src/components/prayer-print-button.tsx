"use client";

type PrayerPrintButtonProps = {
  title: string;
  imageUrl: string;
};

export function PrayerPrintButton({ title, imageUrl }: PrayerPrintButtonProps) {
  function printPrayer() {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;

    printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>html,body{margin:0;background:#fff}img{display:block;max-width:100%;max-height:100vh;margin:auto}@media print{@page{margin:.35in}img{max-width:100%;max-height:none}}</style></head><body><img src="${imageUrl}" alt="${title}" onload="window.print()" /></body></html>`);
    printWindow.document.close();
  }

  return <button className="prayer-print-button" type="button" onClick={printPrayer} aria-label={`Print ${title}`}>Print <span>↗</span></button>;
}
