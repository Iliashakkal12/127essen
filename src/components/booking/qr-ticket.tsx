"use client";

import { QRCodeSVG } from "qrcode.react";

export function QrTicket({ value }: { value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <QRCodeSVG value={value} size={168} fgColor="#2b1e14" level="M" />
    </div>
  );
}
