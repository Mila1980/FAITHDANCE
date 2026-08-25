"use client";

type PrayerPrintButtonProps = {
  title: string;
  imageUrl: string;
};

export function PrayerPrintButton({ title, imageUrl }: PrayerPrintButtonProps) {
  function printPrayer() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const imageSource = new URL(imageUrl, window.location.origin).href;

    printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>@page{size:letter portrait;margin:.25in}html,body{width:8in;height:10.5in;margin:0;background:#fff}body{display:grid;place-items:center}img{display:block;width:auto;height:auto;max-width:8in;max-height:10.5in;object-fit:contain;margin:auto}@media print{html,body{width:8in;height:10.5in}img{max-width:8in;max-height:10.5in}}</style></head><body><img src="${imageSource}" alt="${title}" onload="setTimeout(() => window.print(), 200)" /></body></html>`);
    printWindow.document.close();
  }

  return <button className="prayer-print-button" type="button" onClick={printPrayer} aria-label={`Print ${title}`}>Print <span>↗</span></button>;
}
