import { ReactNode } from "react";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#1a2446] bg-[#1b254b] px-2 py-1 text-xs text-[#b9c6ff]">
      {children}
    </span>
  );
}
