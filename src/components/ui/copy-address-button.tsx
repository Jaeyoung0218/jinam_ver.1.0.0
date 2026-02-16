"use client";

import { Copy } from "lucide-react";

type Props = {
  address: string;
  label?: string;
};

export default function CopyAddressButton({ address, label = "한국 주소 복사" }: Props) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(address)}
      className="rounded-xl border border-[#E2E8F5] bg-white px-3 py-2 text-center text-sm font-semibold text-[#1D2742]"
    >
      <Copy className="mr-1 inline h-4 w-4" />
      {label}
    </button>
  );
}
